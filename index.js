const fs = require('fs')
const path = require('path')

let data = fs.readFileSync(path.join(__dirname, "data.json"), { encoding: "utf-8" })
data = JSON.parse(data)
let last_data = data
data = data.sheets[0].celldata.reduce((simpan, row) => {
    const { r, c, v } = row
    if (simpan[r]) {
        simpan[r].push(v)
    } else {
        simpan[r] = [v]
    }
    return {
        ...simpan,
    }
}, {})
const total_length = Object.keys(data).length - 1
data = Object.keys(data).filter((_, i) => i > 0).reduce((simpan, r) => {
    if (simpan.find(v => v.name === data[r][0].v)) {
        return [
            ...simpan,
        ]
    }
    return [
        ...simpan,
        {
            r,
            name: data[r][0].v,
        }
    ]
}, [])
const foreign_keys = [0, ...data.map(v => parseInt(v.r))]
last_data.sheets[0].celldata = last_data.sheets[0].celldata.filter(v => {
    // console.log({ v });
    return foreign_keys.includes(v.r)
})

const fix_length = data.length
const length = {
    total: total_length,
    fix: fix_length,
    sisa: total_length - fix_length
}

console.log({ length });

// fs.rmSync("result.json")
fs.writeFileSync("result.json", JSON.stringify(last_data, null, 2), { encoding: "utf-8" })
console.log("data finalll", JSON.stringify(last_data, null, 2));