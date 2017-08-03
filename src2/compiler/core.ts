namespace SugarCpp {
    export function forEach<T, U>(array: T[], callback: (element: T) => U): U {
        var result: U;
        if (array) {
            for (var i = 0, len = array.length; i < len; i++) {
                if (result = callback(array[i])) {
                    break;
                }
            }
            return result;
        }
    }
}