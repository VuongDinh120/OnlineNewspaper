const categoryModel = require('../models/category.model');

module.exports = async function () {
    const listCat = await categoryModel.all();
    const listMenu = await categoryModel.allWithOnlyFirstNode();
    const listExtra = new Array();

    for (let i = 0; i < listMenu.length; i++) {
        const a = [];
        for (let j = 0; j < listCat.length; j++) {
            if (listMenu[i].CatID === listCat[j].ParentID) {
                const ob = {
                    CatName: listCat[j].CatName,
                    CatID: listCat[j].CatID
                }
                a.push(ob);
            }
        }
        listMenu[i].Descendants = a;
    }

    let countExtra = listMenu.length - 8;
    let isfull;

    if (countExtra == 0) {
        isfull = true;
    } else if (countExtra > 0) {
        isfull = false;
        for (let i = 1; i <= countExtra; i++) {
            let item = listMenu.pop();
            listExtra.push(item);
        }
    }
    const ob = {
        isfull,
        listMenu,
        listExtra
    }

    return ob;
}
