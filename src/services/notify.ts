import { log } from '@/services/logger'

export function notify(message: string){
    log && console.log(message);
}