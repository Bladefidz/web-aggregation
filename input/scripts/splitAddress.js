module.exports = {
	run: function(data) {
		data = data.split("<br>");
		let data1 = new Array(5);
		let i = 0;
		while (data[0][i] != " ") {
			i++;
		}
		data1[0] = data[0].substring(0, i);
		data1[1] = data[0].substring(i + 1);
		i = 0;
		while (data[1][i] != ",") {
			i++;
		}
		data1[2] = data[1].substring(0, i);
		let j = i;
		while(data[1][j] != " ") {
			j++;
		}
		data1[3] = data[1].substring(i + 2, j);
		data1[4] = data[1].substring(j + 1);
		return data1;
	}
}