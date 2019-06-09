export default new class Util{
    constructor(){

    }
    /**
     * 把一个数组的横向存储变成纵向存储，势必结果会把一维数组转成二维数组
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
    fillArray(target = [], element = '', rowLen = 1, colLen = 0){

        let result = target;
        if(colLen){
            multiDimonsional(rowLen,colLen);
        }else{
            oneDimonsional(rowLen);
        }
        
        function multiDimonsional(y){
            while(y--){
                if(!result[y]) result[y] = [];
                let x = colLen;
                while(x--){
                    if(!result[y][x]) result[y][x] = element;
                }
            }
        }

        function oneDimonsional(y){
            while(y--){
                if(!result[y]) result[y] = element;
            }
        }


        return result;
    }

}