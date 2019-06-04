export default new class Util{
    constructor(){

    }
    /**
     * 把一维数组排列成多维数组
     * @target Array(one-dimensional)
     * @rowLen Number
     * @return Array(multi-dimensional)
     */
    rowToCol(target, rowLen){
        if(!rowLen || typeof rowLen !== 'number' || rowLen === Infinity){          
            throw 'util.rowToCal() need a total number at the second argument';
            return target;
        }
        if(rowLen <= 1) return target;
        const result = [
            // [{},{},{}]
            // [{},{}]
        ];
       
        let x = 0; // 代表列的下表
        let y = 0; // 代表行的下表
        let i = 0; // 代表target元素的下表
        while(i < target.length){
            let loop = rowLen;
            while(loop--){
                if(y >= target.length) break;
                if(!result[y]) result[y] = [];
                if(target[i]) result[y][x] = target[i];                                   
                i++;
                y++;
            }
            y = 0;
            x ++;
        };

        return result;
    }
    /**
     * 只支持二维数组
     * @target
     * @rowLen
     * @colLen
     * @element
     * @return
     * 
     */
    fillArray(target,rowLen,colLen,element){
        let result = target;
        let y = rowLen;
        while(y--){
            if(!result[y]) result[y] = [];
            let x = colLen;
            while(x--){
                if(!result[y][x]) result[y][x] = element;
            }
        }
        return result;
    }

}