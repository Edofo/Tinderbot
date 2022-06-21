import fetch from "node-fetch";

import likeOrDislike from "./likeOrDislike"
import file from "../data/params.json";


const badVibes = file.badVibes
const goodVibes = file.goodVibes

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

export default fetchCore