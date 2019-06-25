import Router from 'vue-router'
import RouterCurrent from '../../router'

export default {
    subIsActive: (paths: string[]) => {
        let r: Router = RouterCurrent;
        return paths.some(path => {
            return (r as any).history.current.fullPath.indexOf(path) === 0
        })
    }
};