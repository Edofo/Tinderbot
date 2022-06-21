import fetch from "node-fetch";
import 'dotenv/config' 

import addUser from "./src/addUser.js";

const goodVibes = {
    passions: [
        'Hot Yoga',
        'Gym',
        'Wine',
        'Ecology',
        'Table tennis',
        'Travel',
        'Volunteering',
        'Music',
        'Comedy',
        'Netflix',
        'Twitch',
        'Nature',
        'Museum',
        'Art',
        'Cooking',
        'Sports',
        'Road trips'
    ],
    desc: [
        'Cocktails',
        'Coffee',
        'Non-smoker'
    ]
}
const badVibes = {
    passions: [
        'Self Care',
        'Manga',
        'TikTok',
        'Politics',
        'Anime',
        'Tattoos',
        'Shopping',
    ],
    desc: [
        'Smoker'
    ]
}

let i = 0
let count = 0

const fetchCore = async() => {
    try {

        let data = await fetch('https://api.gotinder.com/v2/recs/core?locale=fr', {
            headers: {
                "x-auth-token": process.env.TOKEN
            }
        })

        data = await data.json()

        if(data.meta.status === 200) {

            data.data.results.map(async(x) => {

                if(x.experiment_info === undefined) {
                    likeOrDislike(x, 'pass', data.data.results)
                    return
                }

                const badPassions = []
                const goodPassions = []
                
                x.experiment_info.user_interests.selected_interests.map((el) => {
                    badVibes.passions.map((y) => el.name === y && badPassions.push(y))
                    goodVibes.passions.map((y) => el.name === y && goodPassions.push(y))
                })
               
                if(x.user.selected_descriptors === undefined) {
                    if(goodPassions.length > 0) {
                        likeOrDislike(x, 'like', data.data.results)
                    } else {
                        likeOrDislike(x, 'pass', data.data.results)
                    }
                    return
                }

                x.user.selected_descriptors.map((el) => {
                    badVibes.desc.map((y) => el.choice_selections[0].name === y && badPassions.push(y))
                    goodVibes.desc.map((y) => el.choice_selections[0].name === y && goodPassions.push(y))
                })

                if(badPassions.length > 0) {
                    likeOrDislike(x, 'pass', data.data.results)
                    return
                }

                likeOrDislike(x, 'like', data.data.results)

            })

        }

    } catch(err) {
        throw err
    }
}

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


const main = async() => {
    try {

        fetchCore()

    } catch(err) {
        throw err
    }
}

main()