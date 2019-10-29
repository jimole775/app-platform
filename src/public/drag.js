/**
 * Created by Andy on 2019/6/6.
 */
export default class Drag{
    /**
     * @usrSetting 
     * {
     *  (*)dragBox: 只支持传入dom、jq对象、id号、或者比较唯一的class号，如果class获取到一堆dom，默认只提取第一个
     *  dragHandle:
     *  extendHandle:
     *  beforeDrag:
     *  afterDrag:
     *  onDrag:
     *  hasEdge:
     * }  
     */
    constructor({
        dragHandle = '',
        dragBox = '',
        extendHandle = '',
        beforeDrag = ()=>{},
        afterDrag = ()=>{},
        onDrag = ()=>{},
        hasEdge = true,
    }) {
        // const dragHandle = dragHandle;
        // const dragBox = dragBox;
        // const extendHandle = extendHandle;
        this.beforeDrag = beforeDrag;
        this.afterDrag = afterDrag;
        this.onDrag = onDrag;
        this.hasEdge = hasEdge;
        this.doc = document;
        this.init(dragHandle, dragBox, extendHandle);
        this.bindEvents();
    }

    /***************
     * 绑定拖拽事件 *
     **************/
    init(dragHandle, dragBox, extendTag) {
        this.winHeight = this.doc.body.clientHeight;
        this.winWidth = this.doc.body.clientWidth;

        this.EVENT_TYPE = {};
        this.EVENT_TYPE.START = "ontouchstart" in window ? "touchstart" : "mousedown";
        this.EVENT_TYPE.MOVE = "ontouchmove" in window ? "touchmove" : "mousemove";
        this.EVENT_TYPE.END = "ontouchend" in window ? "touchend" : "mouseup";

        this.extendEvent = {};
        this.dragEvent = {};

        this.edge = {};
        this.edge.bottom = this.winHeight - 2;
        this.edge.right = this.winWidth - 2;
        this.edge.top = 1;
        this.edge.left = 1;

        this.originX = 0;
        this.originY = 0;
        this.startX = 0;
        this.moveX = 0;
        this.endX = 0;
        this.startY = 0;
        this.moveY = 0;
        this.endY = 0;

        this.initDrag(this.queryTag(dragHandle, "dragHooker"));
        this.initBody(this.queryTag(dragBox ? dragBox : dragHandle));
        if (extendTag) this.initExtend(this.queryTag(extendTag));
    }

    initBody(dragBox) {
        this.dragBox = dragBox;      
        this.ghostBox = null;  
        this.bodyWidth = this.dragBox.clientWidth;
        this.bodyHeight = this.dragBox.clientHeight;
    }

    initDrag(dragHandle) {
        this.dragHandle = dragHandle;
        this.dragEvent.dragStart = false;
        this.dragEvent.distanceX = 0;
        this.dragEvent.distanceY = 0;
    }

    initExtend(extendTag) {
        this.extendTag = extendTag;
        this.extendEvent.extendStart = false;
        this.extendEvent.distanceX = 0;
        this.extendEvent.distanceY = 0;
    }

    bindEvents() {
        if (this.dragHandle) this.bindDragStart();
        if (this.extendTag) this.bindExtendStart();
        this.bindMoveEvent();
        this.bindEndEvent();
    }

    bindDragStart() {
        var that = this;
        that.dragHandle.addEventListener(that.EVENT_TYPE.START, function (e) {
            that.dragEvent.dragStart = true;

            // 区分 PC 端和 phone 端的浏览器提供的事件
            var target = e.changedTouches ? e.changedTouches[0] : e;
            that.startX = target.clientX;    // 获取点击点的X坐标
            that.startY = target.clientY;    // 获取点击点的Y坐标
            that.originX = that.dragBox.offsetLeft;  // 相对于当前窗口X轴的偏移量
            that.originY = that.dragBox.offsetTop;   // 相对于当前窗口Y轴的偏移量
            that.distanceX = that.startX - that.originX;   // 鼠标所能移动的最左端是当前鼠标距div左边距的位置
            that.distanceY = that.startY - that.originY;
            that.ghostBox = that.cloneGhost(that.dragBox);
            that.beforeDrag && that.beforeDrag(that, e);
        });
    }

    bindMoveEvent() {
        var that = this;
        // 这里把事件绑到body元素，使移动更加舒服
        this.doc.body.addEventListener(that.EVENT_TYPE.MOVE, function (e) {
            if (that.dragEvent.dragStart) {
                that.dragMoveEvent(that, e);
            } else if (that.extendEvent.extendStart) {
                that.extendMoveEvent(that, e);
            }
        });
    }

    bindEndEvent() {
        var that = this;
        this.doc.body.addEventListener(that.EVENT_TYPE.END, function (e) {
            if (that.dragEvent.dragStart) {
                that.dragEvent.dragStart = false;
                that.dragEndEvent(that, e);
            } else if (that.extendEvent.extendStart) {
                that.extendEvent.extendStart = false;
                that.extendEndEvent(that, e);
            }
        });
    }

    bindExtendStart() {
        /*******************
         * 绑定窗体拉伸事件 *
         *****************/
        var that = this;
        that.extendTag.addEventListener(that.EVENT_TYPE.START, function (e) {
            that.extendEvent.extendStart = true;
            //clearTimeout(that.mouseOutMonitor);
            var target = e.changedTouches ? e.changedTouches[0] : e;
            var startX = target.clientX;    // 获取点击点的X坐标
            var startY = target.clientY;    // 获取点击点的Y坐标
            that.originX = that.dragBox.offsetLeft; // 相对于当前窗口X轴的偏移量
            that.originY = that.dragBox.offsetTop;  // 相对于当前窗口Y轴的偏移量
            that.extendEvent.distanceX = startX - that.originX; // 鼠标所能移动的最左端是当前鼠标距div左边距的位置
            that.extendEvent.distanceY = startY - that.originY;

            // 由于全屏显示的功能的存在，不得不动态获取当前窗口的高宽
            that.winHeight = this.doc.body.clientHeight;
            that.winWidth = this.doc.body.clientWidth;
        });

    }

    queryTag(tag, dragHooker) {
        var realTag = null;
        if (typeof tag === "string") {
            realTag = this.doc.querySelectorAll(tag)[0];
        }
        else if (typeof tag === "object") {
            if (tag.nodeType) { // 有nodeType值的,确定是Dom对象
                realTag = tag;
            } else {    // 否则是jqLit对象
                realTag = tag[0];
            }
        }

        if (realTag && dragHooker) {

            realTag.style.cursor = "move";
            realTag.style["-webkit-touch-callout"] = "none";
            realTag.style["-webkit-user-select"] = "none";
            realTag.style["-khtml-user-select"] = "none";
            realTag.style["-moz-user-select"] = "none";
            realTag.style["-ms-user-select"] = "none";
            realTag.style["user-select"] = "none";
        }

        return realTag;
    }

    dragMoveEvent(that, e) {
        // 区分 PC 端和 phone 端的浏览器提供的事件
        var target = e.changedTouches ? e.changedTouches[0] : e;

        that.moveX = target.clientX; // 移动过程中X轴的坐标
        that.moveY = target.clientY; // 移动过程中Y轴的坐标
        if (that.hasEdge) {
            // 框体移到最右端
            if (that.moveX + (that.bodyWidth - that.distanceX) >= that.winWidth) {
                that.ghostBox.style.left = (that.winWidth - that.bodyWidth) + "px";
                that.ghostBox.style.top = (that.moveY - that.distanceY) + "px";
                return;
            }

            // 框体移到最下端
            if (that.moveY + (that.bodyHeight - that.distanceY) >= that.winHeight) {
                that.ghostBox.style.left = (that.moveX - that.distanceX) + "px";
                that.ghostBox.style.top = (that.winHeight - that.bodyHeight) + "px";
                return;
            }

            // 框体移到最左端
            if (that.moveX <= that.distanceX) {
                that.ghostBox.style.left = 0;
                that.ghostBox.style.top = (that.moveY - that.distanceY) + "px";
                return;
            }

            // 框体移到最上端(一般情况下，拖动手柄都在顶部，不管用户怎么设置，都应该禁止把把手部分拖出当前窗口)
            if (that.moveY <= that.distanceY) {
                that.ghostBox.style.left = (that.moveX - that.distanceX) + "px";
                that.ghostBox.style.top = 0;
                return;
            }
        }
        // 当鼠标移出窗口
        if (that.moveY >= that.edge.bottom
            || that.moveY <= that.edge.top
            || that.moveX >= that.edge.right
            || that.moveX <= that.edge.left) {
            // that.dragEvent.dragStart = false;
            console.log("is move out!");
        }
        // if(Math.abs(that.moveX - that.startX) >= 5){
            that.ghostBox.style.left = (that.moveX - that.distanceX) + "px";
            that.ghostBox.style.top = (that.moveY - that.distanceY) + "px";
            that.onDrag && that.onDrag(that, e);
        // }
    }

    dragEndEvent(that, e) {
        var bodyLeft = that.ghostBox.offsetLeft + "px";
        var bodyTop = that.ghostBox.offsetTop + "px";
        if (that.hasEdge) {
            if (bodyTop < 0) {
                bodyTop = 0;
            }
            else if (bodyTop > that.winHeight - that.bodyHeight) {
                bodyTop = (that.winHeight - that.bodyHeight) + "px";
            }

            if (bodyLeft < 0) {
                bodyLeft = 0;
            }
            else if (bodyLeft > that.winWidth - that.bodyWidth) {
                bodyTop = (that.winWidth - that.bodyWidth) + "px";
            }
        }
        that.dragBox.style.left = bodyLeft;
        that.dragBox.style.top = bodyTop;

        that.removeGhost();
        that.afterDrag && that.afterDrag(that, e);
    }

    extendMoveEvent(that, e) {
        //e.preventDefault(); // 取消move的默认行为 [拉，划，滚动]
        var target = e.changedTouches ? e.changedTouches[0] : e;
        that.moveX = target.clientX; // 移动过程中X轴的坐标
        that.moveY = target.clientY; // 移动过程中Y轴的坐标

        if (that.moveX >= that.winWidth) {
            that.moveX = that.winWidth - 10;
        }
        if (that.moveX <= 10) {
            that.moveX = 10;
        }
        if (that.moveY >= that.winHeight) {
            that.moveY = that.winHeight - 10;
        }
        if (that.moveY <= 10) {
            that.moveY = 10;
        }

        that.dragBox.style.width = (that.bodyWidth + (that.moveX - that.extendEvent.distanceX - that.originX)) + "px";
        that.dragBox.style.height = (that.bodyHeight + (that.moveY - that.extendEvent.distanceY - that.originY)) + "px";

    }

    extendEndEvent(that, e) {
        //clearTimeout(that.mouseOutMonitor);
        var target = e.changedTouches ? e.changedTouches[0] : e;
        var endX = target.clientX;  // 移动过程中X轴的坐标
        var endY = target.clientY;  // 移动过程中Y轴的坐标

        that.dragBox.style.width = (that.bodyWidth + (endX - that.extendEvent.distanceX - that.originX)) + "px";
        that.dragBox.style.height = (that.bodyHeight + (endY - that.extendEvent.distanceY - that.originY)) + "px";

        var endWidth = parseFloat(that.dragBox.style.width);
        var endHeight = parseFloat(that.dragBox.style.height);
        if (endWidth < 200) {
            that.dragBox.style.width = "200px";
        }
        if (endHeight < 200) {
            that.dragBox.style.height = "200px";
        }
        if (endWidth >= that.winWidth - that.dragBox.offsetLeft - 10) {
            that.dragBox.style.width = that.winWidth - that.dragBox.offsetLeft - 10 + "px";
        }
        if (endHeight >= that.winHeight - that.dragBox.offsetTop - 10) {
            that.dragBox.style.height = that.winHeight - that.dragBox.offsetTop - 10 + "px";
        }

        // 触摸事件完成后，获取盒子的最后高宽，下次再次触摸时，以这个值为初始值；
        that.bodyWidth = parseFloat(that.dragBox.style.width);
        that.bodyHeight = parseFloat(that.dragBox.style.height);

        console.log("extend end");
    }

    cloneGhost(target){
        this.removeGhost();
        const box = this.doc.createElement('div');
        box.id = '_appPlatform_dragGhost';
        box.style.width = target.clientWidth + 'px';
        box.style.height = target.clientHeight + 'px';
        box.style.top = target.offsetTop + 'px';
        box.style.left = target.offsetLeft + 'px';
        box.style.border = '4px solid rgba(200,200,200,0.7)';
        box.style.position = 'fixed';
        box.style.zIndex = '99999';
        this.doc.body.appendChild(box);
        return box;
    }

    removeGhost(){
        const ghost = this.doc.querySelector('#_appPlatform_dragGhost');
        ghost && ghost.remove();
    }
}