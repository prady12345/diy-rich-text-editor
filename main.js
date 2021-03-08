var myRichTextEditor = new (function() {

	var self = this;

	self.init = function(args) {


		//load icons
		loadIcons();

		//hide the textarea
		document.getElementById(args.selector).style.display = 'none';

		var defaultElements = [
			{command: 'bold', type: 'button', innerHTML: '<i class="fas fa-bold"></i>'},
			{command: 'italic', type: 'button', innerHTML: '<i class="fas fa-italic"></i>'},
			{command: 'underline', type: 'button', innerHTML: '<i class="fas fa-underline"></i>'},
			{command: 'strikeThrough', type: 'button', innerHTML: '<i class="fas fa-strikethrough"></i>'},
			{command: 'justifyCenter', type: 'button', innerHTML: '<i class="fas fa-align-center"></i>'},
			{command: 'justifyFull', type: 'button', innerHTML: '<i class="fas fa-align-justify"></i>'},
			{command: 'justifyLeft', type: 'button', innerHTML: '<i class="fas fa-align-left"></i>'},
			{command: 'justifyRight', type: 'button', innerHTML: '<i class="fas fa-align-right"></i>'},

			//new buttons added
			{command: 'insertUnorderedList', type: 'button', innerHTML: '<i class="fa fa-list-ul"></i>'},
			{command: 'insertOrderedList', type: 'button', innerHTML: '<i class="fa fa-list-ol"></i>'},
			{command: 'indent', type: 'button', innerHTML: '<i class="fa fa-indent"></i>'},
			{command: 'outdent', type: 'button', innerHTML: '<i class="fa fa-outdent"></i>'},
			{command: 'formatBlock', type: 'select', innerHTML: '', options: ['H1', 'H2', 'H3', 'H4']},
			{command: 'insertHorizontalRule', type: 'button', innerHTML: 'HR'},
			{command: 'createLink', type: 'button', innerHTML: '<i class="fa fa-link"></i>'},
			{command: 'unlink', type: 'button', innerHTML: '<i class="fa fa-unlink"></i>'},
			{command: 'fontName', type: 'select', innerHTML: '', options: ['Arial', 'Comic Sans MS', 'Courier', 'Georgia', 'Times New Roman', 'Verdana']},
			{command: 'fontSize', type: 'select', innerHTML: '', options: [1, 2, 3, 4, 5, 6, 7]},
			{command: 'insertImage', type: 'button', innerHTML: '<i class="fa fa-file-image"></i>'},
			{command: 'viewSourceCode', type: 'button', innerHTML: '<i class="fa fa-code"></i>'},
			
		];


		//container
		var container = document.createElement('div');
		container.setAttribute('id', 'myRichTextEditorFieldContainer');
		container.appendAfter(document.getElementById(args.selector));


		//iframe editable
		var contentEditable = document.createElement('iframe');
		contentEditable.setAttribute('name', 'myRichTextEditorField');
		contentEditable.setAttribute('id', 'myRichTextEditorField');
		contentEditable.style.width = '100%';
		contentEditable.style.height = '500px';
		contentEditable.style.border = 'solid 1px lightgrey';

		container.appendChild(contentEditable);

	
		//make the iframe editor in the browser
		contentEditable.contentDocument.designMode = "on";

		//loop
		for(var el = 0 in defaultElements) {

			var thisElement;

			if (el > 0)
				thisElement = element;


			//create element
			var element = document.createElement(defaultElements[el].type);
			
			element.setAttribute('title', defaultElements[el].command);

			element.innerHTML = defaultElements[el].innerHTML;
			element.style.margin = '0 5px 5px 0';


			var command;
			var argument = null;

			//if its button
			if (defaultElements[el].type.indexOf('button') !== -1) {
			
				var showCode = false
				var isPrompt = false;

				element.onclick = function () {
					command = this.getAttribute('title'); //bold
					if (command == 'viewSourceCode') {
						//view source of the html tags
						showCode = execViewSourceCommand(element, contentEditable, showCode);
					} else {
						switch (command) {
							//for insert image
							case 'insertImage':
								argument = prompt('Enter image your URL: ');
								isPrompt = true;
								break;

							//for insert link
							case 'createLink':
								argument = prompt('Enter your URL: ');
								isPrompt = true;
								break;
						}

						if ((argument !== null && isPrompt) || !isPrompt)
							myRichTextEditorField.document.execCommand(command, false, argument);
					}
			
				};

			} else {
				//if not button

				//check if fonts or headings since those are droplists box
				if (isThisElement(defaultElements[el], 'fontName')
					|| isThisElement(defaultElements[el], 'fontSize')
					|| isThisElement(defaultElements[el], 'formatBlock')) {

					for(var o = 0 in defaultElements[el].options) {
						// create new option element
						var opt = document.createElement('option');

						// create text node to add to option element (opt)
						opt.appendChild( document.createTextNode(defaultElements[el].options[o]) );

						// set value property of opt
						opt.value = defaultElements[el].options[o]; 

						// add opt to end of select box (sel)
						element.appendChild(opt); 
					}
				}

				element.onchange = function () {
					command = this.getAttribute('title');
					myRichTextEditorField.document.execCommand(command, false, this.value);
				};

			}


			//append
			if (el > 0) {
				element.appendAfter(thisElement);
			} else {
				element.appendBefore(contentEditable);
			}

		}

	};


	Element.prototype.appendBefore = function( element) {
		
		element.parentNode.insertBefore(this, element);

	}, false;


	Element.prototype.appendAfter = function( element) {
		
		element.parentNode.insertBefore(this, element.nextSibling);

	}, false;


	var loadIcons = function() {

		var stylesheet = document.createElement('link');
		stylesheet.href= 'https://use.fontawesome.com/releases/v5.8.1/css/all.css?integrity=sha384-50oBUHEmvpQ+1lW4y57PTFmhCaXp0ML5d60M1M7uH2+nqUivzIebhndOJK28anvf';
		stylesheet.rel = 'stylesheet';
		stylesheet.type ='text/css';

		//append to the head as a child
		document.head.appendChild(stylesheet);

	};


	function isThisElement(defaultElements, v) {
		return defaultElements.command.indexOf(v) !== -1;
	}


	function execViewSourceCommand(element, contentEditable, showCode) {
		if (!showCode) {
			contentEditable.contentDocument.getElementsByTagName('body')[0].textContent = contentEditable.contentDocument.getElementsByTagName('body')[0].innerHTML;
			showCode = true;
		} else {
			contentEditable.contentDocument.getElementsByTagName('body')[0].innerHTML = contentEditable.contentDocument.getElementsByTagName('body')[0].textContent;
			showCode = false;
		}

		return showCode;
	}


});
