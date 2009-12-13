function objectTag() {
	var 
		// �������� ���������, ������ � ��� ��� �������� �����
		selection = ts.getSelection(false, false).replace(/\s*[\r\n]\s*/mg, ''), 

		// ����������� �������� ������������ HTML/CSS
		type = ts.hasParent('style', '', '') ? 'css' : 'html',

		// ����������� ��� ���������: HTML/xHTML 
		profile = ts.isXHTML() ? 'xhtml' : 'html', 

		// ������������� ������������
		text = zen_coding.expandAbbreviation(selection, type, profile);

	if (!text)
		return '';

	text = text.toString(true);

	// ������� ��� ������� | (������� �������), ����� �������.
	var cursor_pos = text.indexOf('|');
	if (cursor_pos!=-1) {
		text = text.substring(0, cursor_pos+1).concat( text.substring(cursor_pos+1).replace(/\|/gm, '') );
	}

	return text;
}