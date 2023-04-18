$(document).ready(function(){
    console.log('Tool loaded')

    $('.withfiles').change(function(){
        this.checked ? $('#filefield').css('display', 'flex') : $('#filefield').hide()
    })

    $('.hassub').change(function(){
        this.checked ? $('#subfolderfield').css('display', 'flex') : $('#subfolderfield').hide()
    })

    $('.withfile').change(function(){
        this.checked ? $('#fileuploadfield').show() : $('#fileuploadfield').hide()
    })
})