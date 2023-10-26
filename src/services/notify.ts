import { log } from '@/services/env'

export function notify(message: string){
    log && console.log(message);
}