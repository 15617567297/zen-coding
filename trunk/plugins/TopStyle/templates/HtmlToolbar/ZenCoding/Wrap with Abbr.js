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
	// ���������� ����������� ������� html/xhtml � ������� �� ����� ����������� ������� �������
	zen_coding.setupProfile("ts_xhtml", {place_cursor: false});
	zen_coding.setupProfile("ts_html", {place_cursor: false, self_closing_tag: false});

	var 
		// �������� ������������
		abbr = document.forms[0].tagname.value, 

		// �������� ���������
		selection = ts.getSelection() || '',

		// ����������� �������� ��������� HTML/CSS
		type = ts.hasParent('style', '', '') ? 'css' : 'html',

		// ����������� ��� ���������: HTML/xHTML 
		profile = ts.isXHTML() ? 'ts_xhtml' : 'ts_html', 
	
		// ������������ ��������� � ������������
		text = zen_coding.wrapWithAbbreviation(abbr, selection, type, profile);


	if (!text)
		return '';

	text = text.toString(true);

	return text;
}