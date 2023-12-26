import typescript from "@rollup/plugin-typescript"

/** @type {import('rollup').RollupOptions} */
export default {
    input:"./index.ts",
    output:{
        file:"./dist/textfield.js",
        format:"iife"
    },
    plugins:[
        typescript()
    ]
}