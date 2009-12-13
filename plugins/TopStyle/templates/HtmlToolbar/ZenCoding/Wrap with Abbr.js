function initUI() {
	document.forms[0].tagname.value = 'div';
	document.forms[0].tagname.focus();
	document.forms[0].tagname.select();
}

function onOK() {
	// TODO: Tag validation
	return trim(document.forms[0].tagname.value) != ''
}

function objectTag() {
	var 
		// �������� ������������
		abbr = document.forms[0].tagname.value, 

		// �������� ���������
		selection = ts.getSelection() || '',

		// ����������� �������� ��������� HTML/CSS
		type = ts.hasParent('style', '', '') ? 'css' : 'html',

		// ����������� ��� ���������: HTML/xHTML 
		profile = ts.isXHTML() ? 'xhtml' : 'html', 
	
		// ������������ ��������� � ������������
		text = zen_coding.wrapWithAbbreviation(abbr, selection, type, profile);


	if (!text)
		return '';

	text = text.toString(true);

	return text;
}