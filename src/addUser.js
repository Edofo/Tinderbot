import fs from "fs";
import util from 'util';

const file = "/data/user_swipe.json";

const addUser = async (user, like) => {
  try {
    const template = {
      _id: user._id,
      isLike: like === "like" ? true : false,
      name: user.name,
      bio: user.bio,
      date: user.birth_date,
      city: user.city,
      schools: [],
      photos: [],
      selected_descriptors: [],
    };

    await user?.schools?.map((x) => {
      template.schools.push({ name: x.name });
    });

    await user?.photos?.map((x) => {
      template.photos.push({
        id: x.id,
        url: x.url,
      });
    });

    await user?.selected_descriptors?.map(async (x) => {
      const templateDesc = {
        id: x.id,
        name: x.name,
        choice_selections: [],
      };

      await x?.choice_selections?.map((x) => {
        templateDesc.choice_selections.push({ id: x.id, name: x.name });
      });

      template.selected_descriptors.push(templateDesc);
    });

    let content = JSON.parse(fs.readFileSync(process.cwd() + file , { encoding: "utf8" }))
    content.push(template)

    console.log(content);

    fs.writeFile(process.cwd() + file, JSON.stringify(content), (err) => {
      if (err) return console.log(err);
    });

  } catch (err) {
    throw err;
  }
};

export default addUser;
