import fetch from "node-fetch";

let i = 0

const likeOrDislike = async(el, like, data, count) => {
    try {
        
        const timer = Math.random() * ((i * 2 + 80) - (i * 2)) + (i * 2)

        setTimeout(async() => {

            let dataFetch = await fetch(`https://api.gotinder.com/${like}/${el.user._id}`, {
                headers: {
                    "x-auth-token": process.env.TOKEN
                }
            })
    
            dataFetch = await dataFetch.json()
            
            i = i + 1
            console.log(`Fait : ${i} personnes |`, `Restant : ${data.length - i} |`, `Total : ${count}`)

            if(dataFetch.status === 200) {
                console.log(el.user.name, like)
            }
            
        }, (timer * 1000))


    } catch(err) {
        throw err
    }
}

export default likeOrDislike