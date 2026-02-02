import path from 'path'
import { fileURLToPath } from 'url'


export function currentDir() {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    console.log("Current dir: " + __dirname)
    return __dirname;
}