/**
 * Undefine 값 체크
 * @param _arr {Array}
 * @return {number}
 */
function undefinedCheck(_arr)
{
    let cnt = 0
    if(_arr.length <=0) {return cnt}

    for(let i = 0; i < _arr.length; i++)
    {
        try
        {
            if(typeof _arr[i] === 'undefined') {
                cnt += 1
            }
        }
        catch (err)
        {
            cnt += 1
        }
    }

    return cnt
}

export {
    undefinedCheck
}