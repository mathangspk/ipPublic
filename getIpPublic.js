const puppeteer = require('puppeteer');
const mysql = require('mysql')
//create config connect to mysql 
var connection = mysql.createConnection({
    host: '113.161.220.166',
    user: 'newuser',
    password: '@51209267192Cvv',
    database: 'manage_ip_public'
});
connection.connect();

setInterval(() => {
    getIpPublic()
}, 10000);

function getIpPublic() {

    puppeteer.launch({ headless: true }).then(async browser => {
        const page = await browser.newPage();
        let currentURL;
        currentURL = "https://ping.eu"
        await page.goto(currentURL);

        const dataWrite = await page.evaluate(() =>
            Array.from(document.querySelectorAll('tr>td.txt14>b')) // 
                .map(compact => ({ ip: compact.innerHTML.trim() })

                ))

        //await console.log(dataWrite[0].ip);
        await browser.close();

        dataInsert = await {
            name: "Ip_Nha",
            ip: dataWrite[0].ip,
            DateandTime: new Date()
        }
        //await console.log(dataInsert)
        //Nếu chưa có giá trị IP_Nha thì sẽ insert vào database, Kiểm tra tồn tại giá trị
        await connection.query('SELECT * FROM ip_public where name = "Ip_Nha"', function (err, result) {
            //console.log(result)
            if (err) {
                connection.end();
                return console.log(err);
            } if (result.length > 0) {
                console.log("ton tai gia tri");
                dataUpdate = {
                    ip: dataWrite[0].ip,
                    DateandTime: new Date()
                }
                connection.query("UPDATE ip_public SET ?  WHERE `name` = 'Ip_Nha';", dataUpdate, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result);
                    }
                });
            } else {
                console.log("Ko Ton tai du lieu");
                var query = connection.query('INSERT INTO ip_public SET ?', dataInsert, function (err,
                    result) {
                    if (err) {
                        console.log('Bi loi roi')
                        //event.sender.send('add-new-error', { message: "Thêm dữ liệu bị lỗi" })
                    } else {
                        console.log(result);
                        //event.sender.send('add-new-successful', dataInsert)
                    }
                });
            }

        })

    });
}


