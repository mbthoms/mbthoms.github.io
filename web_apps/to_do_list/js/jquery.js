// All function at the top of the document.
function addListItem() {
	var text = $("#new-text").val();
	$("#todolist").append('<li><input type="checkbox" class="done"><div contenteditable="true" class="editableText">' + text + ' </div><button class="delete">Delete Item</button></li>');
	$("#new-text").val('');
}

function deleteItem() {
	$(this).parent().fadeOut("slow");
}

function finishItem() {
	if ($(this).parent().css('textDecoration') == 'line-through') {
		$(this).parent().css('textDecoration', 'none');
		$(this).parent().css('background-color', 'lightgray');

	} else {
		$(this).parent().css('textDecoration', 'line-through');
		$(this).parent().css('background-color', 'lightgreen');
	}
}

$(function() {
	//When clicked, run addListItem function to add the item to the list.
	$("#add").on('click', addListItem);
	//When clicked, run the delete_item function to remove the item from the list.
	$(document).on('click', '.delete', deleteItem);
	//When clicked, run the finishItem function to strikethough the item and apply green background to the item to show that it is done.
	$(document).on('click', '.done', finishItem);
});