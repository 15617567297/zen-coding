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

// ���������� ������������ � ������ ��� �������� (CRLF ��� LF).
function getNewLineMark(text) {
	return ( text.match(/\r\n/m) ? '\r\n' : '\n' )
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


function wrap(every) {
	var every = !!every,
		text = ts.getSelection() || '',

		// ���������� ��� �������� (CRLF ��� LF)
		nl = getNewLineMark(text),

		// ��������� ��������� �� �������
		lines = ts.getSelection().split(nl),

		// �������� ������ ������� � �������� 
		tag = trim(document.forms[0].tagname.value),

	    	// �������� ��� ��� ���������
		tag_name = tag.replace(/([^\s]+).*$/, "$1")

	// ���� ��������� ������������ ����������� ��� � ���
	if (lines.length == 1) {
		res = lines[0].replace(/([^\s].*[^\s])|([^\s])/, '<' + tag + '>$1$2<' + tag_name + '>')
	}
	else {
		// ������ ������ ����������� ����� ��� ���������� ������� ����� (TopStyle �� �� ��������).
		res = lines[0].replace(/([^\s].*[^\s])|([^\s])/, '<'+tag+'>$1$2' + 
			(every ? '</'+tag_name+'>' : '') )

		// � ��������� ����� ����� �������������� � ��� ������� ������� �����, 
		// ����� ��������������� ������, ������� ������������� ������� TopStyle.
		for(var i=1, len=lines.length; i<len; i++)
		    res += nl + lines[i].replace(/(\s*)(([^\s].*[^\s])|([^\s]))/, 
			(every ? '<'+tag+'>' : '') + '$2$4' +  
			(every || i==len-1 ? '</'+tag_name+'>' : ''))
	}

	return preservePipe(res)
}