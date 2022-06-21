import fetch from "node-fetch";

const likeOrDislike = async(el, like, data) => {
    try {
        
        const timer = Math.random() * ((i + 7 + 60) - (i + 7)) + (i + 7)

        setTimeout(async() => {

            // let dataFetch = await fetch(`https://api.gotinder.com/${like}/${el.user._id}`, {
            //     headers: {
            //         "x-auth-token": process.env.TOKEN
            //     }
            // })
    
            // dataFetch = await dataFetch.json()

            
            i = i + 1
            count = count + 1
            console.log(`Fait : ${i} personnes |`, `Restant : ${data.length} |`, `Total : ${count}`)
            if(i === 1) {
                addUser(el.user, like)
            }
    
            if(data.length === i) {
               i = 0

            //    if(count < 500) {
            //        main()
            //    }
            }
    
            // if(dataFetch.status === 200) {
            //     console.log(el.user.name, like)
            //     addUser(el.user)
            // }

            
        }, (timer * 1000))


    } catch(err) {
        throw err
    }
}

export default likeOrDislike