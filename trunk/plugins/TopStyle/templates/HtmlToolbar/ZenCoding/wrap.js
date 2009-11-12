/** 
  * Wrap in Tag plugin for TopStyle 4.0
  * Author: Vladimir Zhuravlev (private.face@gmail.com)
  */

function initUI() {
	document.forms[0].tagname.value = 'span';
	document.forms[0].tagname.focus();
	document.forms[0].tagname.select();
}

function onOK() {
	// TODO: Tag validation
	return trim(document.forms[0].tagname.value) != ''
}

// ���������� ������������ � ������ ��� �������� (CR, LF ��� CRLF).
function getNewLineMark(text) {
	return ( text.match(/\r\n/m) ? '\r\n' : 
			( text.match(/\r^\n/) ? '\r' : '\n' ) )
}

// ��������� ������� "|" � ������.
function preservePipe(text) {
	/* 
	   ������ "|" ���������������� TopStyle ��� ������ ������� �������, �������, ���� �������� ����� ��� ��������,
	   �� ����� �� �� �������, ����� ��������� ��� ���� � ������.
	*/
	if (text.match(/\|/m))
		return text.replace(/^(\s*)/, '$1|')
	else 
		return text
}

// �������� ���������� ������� ������ � ����� � ������.
function trim(s) {
	return s.replace(/^\s+/, '').replace(/\s+$/, '')
}

// ��������������� ��������� ������� �����. �������� ����� ������� � ���� �����, 
// ����� ������ (����� �������������� ������, ������� ������� TopStyle), 
// � ����� ������� ������ (start) � ��������� (end) �������� ������ � ������. 
function preProcessor(text) {
	var start = -1, end = text.length
	for(var i=0; i < text.length; i++) {
		if (i) text[i] = text[i].replace(/^\s*/, '')

		if (start+1 == i && text[i].match(/^\s*$/))
			start = i
		else if (i > start && text[i].match(/^\s*$/))
			end = (i < end ? i : end)
		else {
			end = text.length
		}
	}

	return {lines: text, start: start+1, end: end-1}
}

function wrap(every) {
	var every = !!every, res = '',
		text = ts.getSelection() || '',

		// ���������� ��� �������� (CR, LF ��� CRLF)
		nl = getNewLineMark(text),

		// ��������� ��������� �� �������
		lines = ts.getSelection().split(nl),

		// �������� ������ ������� � �������� 
		tag = trim(document.forms[0].tagname.value),

	    	// �������� ��� ��� ���������
		tag_name = tag.replace(/([^\s]+).*$/, "$1");

	pre = preProcessor(lines)
	lines = pre.lines

	for(var i=0, len=lines.length; i<len; i++)
	    res += 
		// ������ line feed ��� ���� �����, ����� ������
		(!i ? '' : nl) +
		// ��������� �������������� ����� ������ �����
		lines[i].replace(/^(\s*)(.*[^\s])(\s*)$/, 
			// ��������� ������ ����� (���� ����)
			'$1' + 
			// ��������� ����� ����� ���� ������ �������� ������ ��� wrap every line
			(every || i==pre.start ? '<'+tag+'>' : '') + 
			// ���� ������
			'$2' +  
			// ��������� ����� ������ ���� ��������� �������� ������ ��� wrap every line
			(every || i==pre.end ? '</'+tag_name+'>' : '') + 
			// ��������� ������ ������ (���� ����)
			'$3')

	return preservePipe(res)
}