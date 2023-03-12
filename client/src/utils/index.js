// this is a file where you can create function which would be reused
import { surpriseMePrompts } from '../constants'
import FIleSaver from 'file-saver'
import FileSaver from 'file-saver'

export function getRandomPrompt(prompt) {
    const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length)
    const retrived = surpriseMePrompts[randomIndex]
    if (retrived === prompt) {
        return getRandomPrompt(prompt)
    }
    return retrived
}

export async function downloadImage(_id, photo) {
    FileSaver.saveAs(photo, `download-${_id}.jpg`)
}

export async function checkIsValidSubscription(account) {

}

export function saveBase64AsFile(base64, fileName) {
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.setAttribute("type", "hidden");
    link.href = "data:text/plain;base64," + base64;
    link.download = fileName;
    link.click();
    document.body.removeChild(link);
}


export function timeStampToDate(unixTime) {
    const milli = unixTime * 1000
    const dateObj = new Date(milli)
    return dateObj.toLocaleString()
}

export const isLiveDeployed = () => {
    if (window.location.origin == "http://localhost:5173") {
        return false
    }
    return true
}

export const subscriptionFee = window.location.origin == "http://localhost:5173" ? 0.0003 : 0.02
export const subScriptionContractAddress = window.location.origin == "http://localhost:5173" ? '0x81b296999Cf4df45B26Cdd3945BD77a7584B51A6' : "0xd7B1bC34881f8f89Dc544179272E0019C169FB3a"
export const base_url = window.location.origin == "http://localhost:5173" ? "http://localhost:8000" : "https://alchemy-university.onrender.com"

const chainsVsAddresses = {
    80001: "0x81b296999Cf4df45B26Cdd3945BD77a7584B51A6",
    137: "0xd7B1bC34881f8f89Dc544179272E0019C169FB3a"
}
export const chainMaps = {
    80001: `https://testnets.opensea.io/assets/mumbai/${chainsVsAddresses[80001]}/`,
    137: `https://opensea.io/assets/matic/${chainsVsAddresses[137]}/`
}

export async function urltoFile(url, filename, mimeType) {
    return (fetch(url)
        .then(function (res) { return res.arrayBuffer(); })
        .then(function (buf) { return new File([buf], filename, { type: mimeType }); })
    );
}
