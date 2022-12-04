let utcDate = new Date()
localTime = utcDate - utcDate.getTimezoneOffset() * 60 * 1000
localDate = new Date(localTime)

document.getElementById('dateTime').value = localDate.toISOString().substring(0, 16)
document.getElementById('idTelegram').value = '5311264729'
document.getElementById('text').value = 'Сделай домашнее заание!'

const onClickSave = async (e) => {
    console.log('onClickSave');
    let dateTime = document.getElementById('dateTime').value
    let idTelegram = document.getElementById('idTelegram').value
    let text = document.getElementById('text').value

    let data = {
        dateTime: dateTime,
        idTelegram: idTelegram,
        text: text
    }

    let res = await fetch('/postData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
    });

    if (res.status === 200) {
        document.getElementById('saveButton').innerText = 'Сохранено'
        document.getElementById('saveButton').classList.remove('btn-primary')
        document.getElementById('saveButton').classList.add('btn-success')
    }
}
