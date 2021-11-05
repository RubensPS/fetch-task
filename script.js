const brandSet = document.querySelector('#marca');
const modelSet = document.querySelector('#modelo');
const url = "https://parallelum.com.br/fipe/api/v1/carros/marcas";
const table = document.querySelector("#dataTable");
const brandArray = [];
let isBrand = false;
const modelArray = [];
let dataArray = [];


const getBrandList = fetch(url)
    .then(arr => arr.json())
    .then(brand => brand.map(x => brandArray.push(x)))
    .catch(err => console.log("Erro ao buscar a marca"));
    

const getModelList = () => {
    let i = brandArray.findIndex(x => x.nome === brandSet.value); 
    let brandCode = brandArray[i].codigo;

    while (modelSet.firstChild) {
        modelSet.removeChild(modelSet.lastChild);
    }
    
    fetch(`${url}/${brandCode}/modelos`)
    .then(arr => arr.json())
    .then(models => {
        models = models.modelos;
        models.map(x => modelArray.push(x));

        modelArray.map(x => {
            let newOption = document.createElement('option');
            let optionText = document.createTextNode(`${x.nome}`);
            newOption.appendChild(optionText);
            newOption.setAttribute(undefined, `${x.nome}`);
            modelSet.appendChild(newOption);
        })

        dataArray = [...modelArray];
    })
    .catch(err => console.log("Erro ao buscar o modelo"));  

    modelArray.splice(0, modelArray.length);
}

const getDataList = () => {
    let i = brandArray.findIndex(x => x.nome === brandSet.value); 
    let brandCode = brandArray[i].codigo;
    let j = dataArray.findIndex(x => x.nome === modelSet.value);
    let modelCode = dataArray[j].codigo;

    while (table.rows.length > 1) {
        table.deleteRow(table.rows.length -1);
    }

    fetch(`${url}/${brandCode}/modelos/${modelCode}/anos`)
    .then(arr => arr.json())
    .then(arr => arr.map(objData => {
        fetch(`${url}/${brandCode}/modelos/${modelCode}/anos/${objData.codigo}`)
        .then(arr => arr.json())
        .then(data => {
            let row = table.insertRow(1);
            let firstCell = row.insertCell(0);
            let secondCell = row.insertCell(1);
            firstCell.innerHTML = `${data.AnoModelo}`;
            secondCell.innerHTML = `${data.Valor}`;
        })
        .catch(() => console.log("Erro ao buscar dados para tabela"));
    }))
    .catch(() => console.log("Erro ao buscar Anos"));

}

function brandList () {
    if (!isBrand) {
        brandArray.map(x => {
        let newOption = document.createElement('option');
        let optionText = document.createTextNode(`${x.nome}`);
        newOption.appendChild(optionText);
        newOption.setAttribute(undefined, `${x.nome}`);
        brandSet.appendChild(newOption);
        isBrand = true;
        })
    }
}



brandSet.addEventListener('click', brandList);
document.querySelector('#listModels').addEventListener('click', getModelList);
document.querySelector('#listData').addEventListener('click', getDataList);

