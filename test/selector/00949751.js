const selector = require('../../lib/modules/selector');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');

let html = fs.readFileSync("00949751.html", 'utf8');

let $ = cheerio.load(html);
let res = [];
let test = $('tbody', 'table');
// for (let i = 0; i < test.children().length - 1; i++) {
// 	res.push(test.children().eq(i).text());
// }

let res1 = {
	"License_Type": "",
	"First_Name": "",
    "Last_Name": "",
    "Mailing_Address_Street_Number": "",
	"Mailing_Address_Street_Name": "",
	"Mailing_Address_City": "",
	"Mailing_Address_State": "",
	"Mailing_Address_Zipcode": "",
	"License_ID": "",
	"Expiration_Date": "",
	"License_Status": "",
	"MLO_License_Endorsement": "",
	"Corporation_License_Issued": "",
	"Broker_License_Issued": "",
	"Salesperson_License_Issued": "",
	"Former_First_Name1": "",
	"Former_Last_Name1": "",
	"Former_First_Name2": "",
	"Former_Last_Name2": "",
	"Main_Office": "",
	"Licensed_Officer1_License_ID": "",
	"Licensed_Officer1_First_Name": "",
	"Licensed_Officer1_Last_Name": "",
	"DBA1": "",
	"DBA2": "",
	"DBA3": "",
	"DBA4": "",
	"DBA5": "",
	"DBA6": "",
	"Branch1": "",
	"Branch1_Street_Number": "",
	"Branch1_Street_Name": "",
	"Branch1_City": "",
	"Branch1_State": "",
	"Branch1_Zipcode": "",
	"Branch2": "",
	"Branch2_Street_Number": "",
	"Branch2_Street_Name": "",
	"Branch2_City": "",
	"Branch2_State": "",
	"Branch2_Zipcode": "",
	"Salespersons": "",
	"Employing_Broker": "",
	"Comment": "",
	"Disiplinary_or_Formal_Action_Documents": ""
};

let fornameCnt = 0;
$('tr').each(function(i, elem) {
	let title = $(this).find("strong");
	if (title.length > 0) {
		title = title.text();
		if (title.includes("License Type")) {
			res1.License_Type = $(this).children().last().text();
		} else if (title.substring(0, 4) == "Name") {
			let name = $(this).children().last().text();
			name = name.split(',');
			res1.First_Name = name[0];
			res1.Last_Name = name[1].trimLeft();
		} else if (title.includes("Mailing Address")) {
			let mail = $(this).children().last().html();
			mail = mail.split("<br>");
			let i = 0;
			while (mail[0][i] != ">") {
				i++;
			}
			mail[0] = mail[0].substring(i + 1);
			i = 0;
			while (mail[0][i] != " ") {
				i++;
			}
			res1.Mailing_Address_Street_Number = mail[0].substring(0, i);
			res1.Mailing_Address_Street_Name = mail[0].substring(i + 1);
			i = 0;
			while (mail[1][i] != ",") {
				i++;
			}
			res1.Mailing_Address_City = mail[1].substring(0, i);
			let j = i + 2;
			while(mail[1][j] != " ") {
				j++;
			}
			res1.Mailing_Address_State = mail[1].substring(i + 2, j);
			res1.Mailing_Address_Zipcode = mail[1].substring(j + 2);
		} else if (title.includes("License ID")) {
			res1.License_ID = $(this).children().last().text();
		} else if (title.includes("Expiration Date")) {
			res1.Expiration_Date = $(this).children().last().text();
		} else if (title.includes("License Status")) {
			res1.License_Status = $(this).children().last().text().trim();
		} else if (title.includes("Salesperson License Issued")) {
			res1.Salesperson_License_Issued = $(this).children().last().text().trim();
		} else if (title.includes("Broker License Issued")) {
			res1.Broker_License_Issued = $(this).children().last().text().trim();
		} else if (title.includes("Former Name")) {
			let n = $(this).children().last().text();
			if (n.match("NO FORMER NAMES") == null) {
				n = n.split(',');
				res1.Former_First_Name1 = n[0];
				res1.Former_Last_Name2 = n[1].trimLeft();
			}
		} else if (title) {

		}
	}
});
console.log(res1);

module.exports = {
    run:function(data) {
    	return data;
    }
}