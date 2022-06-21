import fetch from "node-fetch";
import fs from "fs";

const file = "/data/user_swipe.json";

import likeOrDislike from "./likeOrDislike.js"
import params from "../data/params.json";
import addUser from "./addUser.js";


const badVibes = params.badVibes
const goodVibes = params.goodVibes

let count = 0

let user = []

const handleLikeDislike = (x, like, data, count) => {
    likeOrDislike(x, like, data, count)
    user.push({user: x.user, like: like})
}

const fetchCore = async() => {
    try {

        let data = await fetch('https://api.gotinder.com/v2/recs/core?locale=fr', {
            headers: {
                "x-auth-token": process.env.TOKEN
            }
        })

        data = await data.json()

        if(data.meta.status === 200) {

            count = count + data?.data?.results?.length

            await data?.data?.results?.map(async(x) => {

                if(x.experiment_info === undefined) {
                    handleLikeDislike(x, 'pass', data.data.results, count)
                    return
                }

                const badPassions = []
                const goodPassions = []
                
                x.experiment_info.user_interests.selected_interests.map((el) => {
                    badVibes.passions.map((y) => el.name === y && badPassions.push(y))
                    goodVibes.passions.map((y) => el.name === y && goodPassions.push(y))
                })
               
                if(x.user.selected_descriptors === undefined) {
                    if(goodPassions.length > 0 || badPassions.length === 0) {
                        handleLikeDislike(x, 'like', data.data.results, count)
                    } else {
                        handleLikeDislike(x, 'pass', data.data.results, count)
                    }
                    return
                }

                x.user.selected_descriptors.map((el) => {
                    badVibes.desc.map((y) => el.choice_selections[0].name === y && badPassions.push(y))
                    goodVibes.desc.map((y) => el.choice_selections[0].name === y && goodPassions.push(y))
                })

                if(badPassions.length > 0) {
                    handleLikeDislike(x, 'pass', data.data.results, count)
                    return
                }

                handleLikeDislike(x, 'like', data.data.results, count)

            })

            if(user.length === data?.data?.results?.length) {

                setTimeout(async() => {
    
                    const content = await JSON.parse(fs.readFileSync(process.cwd() + file , { encoding: "utf8" }))
                    const tab = content

                    let countAdd = 0

                    user?.map(async(x) => {
                        const template = await addUser(x.user, x.like)
                        tab.push(template)
                        countAdd = countAdd + 1
                        if(countAdd === user.length) {
                            fs.writeFile(process.cwd() + file, JSON.stringify(tab), (err) => {
                                if (err) return console.log(err);
                            });
                        }
                    })
                    
                }, 80000)
                
            }

        }

    } catch(err) {
        throw err
    }
}

export default fetchCore