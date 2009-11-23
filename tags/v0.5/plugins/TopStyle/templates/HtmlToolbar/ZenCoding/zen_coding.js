/**
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 * @adapted to TopStyle 4.0 by Vladimir Zhuravlev (private.face@gmail.com)
 */
var zen_coding = (function(){
	
	var re_tag = /<\/?[\w:\-]+(?:\s+[\w\-:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*\s*(\/?)>$/;
	
	/**
	 * ���������, �������� �� ������ ���������� � ������������
	 * @param {String} ch
	 * @return {Boolean}
	 */
	function isAllowedChar(ch) {
		var char_code = ch.charCodeAt(0),
			special_chars = '#.>+*:$-_!@';
		
		return (char_code > 64 && char_code < 91)       // uppercase letter
				|| (char_code > 96 && char_code < 123)  // lowercase letter
				|| (char_code > 47 && char_code < 58)   // number
				|| special_chars.indexOf(ch) != -1;     // special character
	}
	
	/**
	 * ���������� ������ �������� ������, ������������ � ���������
	 * @return {String}
	 * -----
	 * � TopStyle ���������� \n.
	 */
	function getNewline() {
		return '\n';
	}
	
	/**
	 * �������� ����� ���������
	 * @param {String} text �����, ������� ����� ������
	 * @param {String|Number} pad ���������� �������� ��� ��� ������
	 * @return {String}
	 * -----
	 * � TopStyle �� ������������, ��� ��� �������� ��� ��������� �������.
	 */
	function padString(text, pad) {
		var pad_str = '', result = '';
		if (typeof(pad) == 'number')
			for (var i = 0; i < pad; i++) 
				pad_str += zen_settings.indentation;
		else
			pad_str = pad;
		
		// ���� ����� �� ������ � �������� ���, ����� ������, ������
		var nl = getNewline(), 
			lines = text.split(/\r?\n/gm);
			
		result += lines[0];
		for (var j = 1; j < lines.length; j++) 
			result += nl + pad_str + lines[j];
			
		return result;
	}
	
	/**
	 * Get the type of the partition based on the current offset
	 * @param {Number} offset
	 * @return {String}
	 * -----
	 * � TopStyle ���� ������ ���������� 'text/html'. 
	 */
	function getPartition(offset){
		return 'text/html'
	}
	
	/**
	 * ���������, �������� �� ������������ ���������
	 * @param {String} abbr
	 * @param {String} type
	 * @return {Boolean}
	 */
	function isShippet(abbr, type) {
		var res = zen_settings[type || 'html'];
		return res.snippets && zen_settings[type || 'html'].snippets[abbr] ? true : false;
	}
	
	/**
	 * ���������, ������������ �� ������ ����������� �����. � �������� 
	 * ������������ ��� �������� �������������� ������� '>' ������������ 
	 * ��� ����
	 * @param {String} str
	 * @return {Boolean}
	 */
	function isEndsWithTag(str) {
		return re_tag.test(str);
	}
	
	/**
	 * ���
	 * @class
	 * @param {String} name ��� ����
	 * @param {Number} count ������� ��� ������� ��� (�� ���������: 1)
	 * @param {String} type ��� ���� (html, xml)
	 */
	function Tag(name, count, type) {
		name = name.toLowerCase();
		type = type || 'html';
		this.name = Tag.getRealName(name, type);
		this.count = count || 1;
		this.children = [];
		this.attributes = [];
		this._res = zen_settings[type];
		
		//��������� �������� �� ���������
		if ('default_attributes' in this._res) {
			var def_attrs = this._res.default_attributes[name];
		if (def_attrs) {
			
			def_attrs = def_attrs instanceof Array ? def_attrs : [def_attrs];
			for (var i = 0; i < def_attrs.length; i++) {
				var attrs = def_attrs[i];
				for (var attr_name in attrs) 
					this.addAttribute(attr_name, attrs[attr_name]);
			}
		}
	}
	}
	
	/**
	 * ���������� ��������� ��� ����
	 * @param {String} name
	 * @return {String}
	 */
	Tag.getRealName = function(name, type) {
		var real_name = name,
			res = zen_settings[type || 'html'],
			aliases = res.aliases || res.short_names || {};
		
		if (aliases && aliases[name]) // ������������: bq -> blockquote
			real_name = aliases[name];
		else if (name.indexOf(':') != -1) {
			// ��������, ���� �� ������������ ��������
			var group_name = name.substring(0, name.indexOf(':')) + ':*';
			if (aliases[group_name])
				real_name = aliases[group_name];
		}
		
		return real_name;
	}
	
	Tag.prototype = {
		/**
		 * ��������� ������ �������
		 * @param {Tag} tag
		 */
		addChild: function(tag) {
			this.children.push(tag);
		},
		
		/**
		 * ��������� �������
		 * @param {String} name �������� ��������
		 * @param {String} value �������� ��������
		 */
		addAttribute: function(name, value) {
			this.attributes.push({name: name, value: value});
		},
		
		/**
		 * ���������, �������� �� ������� ������� ������
		 * @return {Boolean}
		 */
		isEmpty: function() {
			return ('empty_elements' in this._res) 
				? this._res.empty_elements[this.name] 
				: false;
		},
		
		/**
		 * ���������, �������� �� ������� ������� ��������
		 * @return {Boolean}
		 */
		isInline: function() {
			return ('inline_elements' in this._res) 
				? this._res.inline_elements[this.name] 
				: false;
		},
		
		/**
		 * ���������, �������� �� ������� ������� �������
		 * @return {Boolean}
		 */
		isBlock: function() {
			return ('block_elements' in this._res) 
				? this._res.block_elements[this.name] 
				: true;
		},
		
		/**
		 * ���������, ���� �� ������� ������� � �������� ����. 
		 * ������������ ��� ��������������
		 * @return {Boolean}
		 */
		hasBlockChildren: function() {
			for (var i = 0; i < this.children.length; i++) {
				if (this.children[i].isBlock())
					return true;
			}
			
			return false;
		},
		
		/**
		 * ����������� ��� � ������. ���� ����� ������� �������� 
		 * <code>format</code> � ����� ����� �������������� �������� ����������
		 * � <code>zen_settings</code>. ����� � ���� ������ ����� �������� 
		 * ������ �|�, ���������� ����� ������� �������. ������ ����� ��������
		 * � ������ ��������� � ��������� ��� ��������
		 * @param {Boolean} format ������������� �����
		 * @param {Boolean} indent ��������� ������
		 * @return {String}
		 */
		toString: function(format, indent) {
			var result = [], 
				attrs = '', 
				content = '', 
				start_tag = '', 
				end_tag = '',
				cursor = format ? '|' : '',
				a;

			indent = indent || false;
				
			// ������ ������ ���������
			for (var i = 0; i < this.attributes.length; i++) {
				a = this.attributes[i];
				attrs += ' ' + a.name + '="' + (a.value || cursor) + '"';
			}
			
			// ������� ��������
			if (!this.isEmpty())
				for (var j = 0; j < this.children.length; j++) {
					content += this.children[j].toString(format, true);
					if (format && this.children[j].isBlock() && j != this.children.length - 1)
						content += getNewline();
				}
			
			if (this.name) {
				if (this.isEmpty()) {
					start_tag = '<' + this.name + attrs + ' />';
				} else {
					start_tag = '<' + this.name + attrs + '>';
					end_tag = '</' + this.name + '>';
				}
			}
			
			// ����������� �����
			if (format) {
				if (this.name && this.hasBlockChildren()) {
					start_tag += getNewline() + zen_settings.indentation;
					end_tag = getNewline() + end_tag;
				}
				
				if (content)
					content = padString(content, indent ? 1 : 0);
				else
					start_tag += cursor;
					
			}
					
			// ������� ��� ������ ���������� ���
			for (var i = 0; i < this.count; i++) 
				result.push(start_tag.replace(/\$/g, i + 1) + content + end_tag);
			
			return result.join(format && this.isBlock() ? getNewline() : '');
		}
	};
	
	function Snippet(name, count, type) {
		/** @type {String} */
		this.name = name;
		this.count = count || 1;
		this.children = [];
		this._res = zen_settings[type || 'html'];
	}
	
	Snippet.prototype = {
		/**
		 * ��������� ������ �������
		 * @param {Tag} tag
		 */
		addChild: function(tag) {
			this.children.push(tag);
		},
		
		addAttribute: function(){
		},
		
		isBlock: function() {
			return true; 
		},
		
		toString: function(format, indent) {
			indent = indent || false;
			
			var content = '', 
				result = [], 
				data = this._res.snippets[this.name],
				begin = '',
				end = '',
				child_padding = '',
				child_token = '${child}';
			
			if (data) {
				if (format) {
					var nl = getNewline();
					data = data.replace(/\n/g, nl);
					// ����� ������, ����� ������ ������ ���� � ��������
					var lines = data.split(nl);
					for (var j = 0; j < lines.length; j++) {
						if (lines[j].indexOf(child_token) != -1) {
							child_padding =  (m = lines[j].match(/(^\s+)/)) ? m[1] : '';
							break;
						}
					}
				}
				
				var parts = data.split(child_token);
				begin = parts[0] || '';
				end = parts[1] || '';
			}
			
			for (var i = 0; i < this.children.length; i++) {
				content += this.children[i].toString(format, true);
				if (format && this.children[i].isBlock() && i != this.children.length - 1)
					content += getNewline();
			}
			
			if (child_padding)
				content = padString(content, child_padding);
			
			
			// ������� ��� ������ ���������� ���
			for (var i = 0; i < this.count; i++) 
				result.push(begin.replace(/\$/g, i + 1) + content + end);
			
			return result.join(format ? getNewline() : '');
		}
	}
	
	return {
		/**
		 * ���� ������������ � ������� ��������� � ���������� ��
		 * @return {String|null}
		 * -----
		 * � TopStyle ������ ���������� ���������� �������.
		 */
		findAbbreviation: function() {
			return ts.getSelection() || ''
		},
		
		/**
		 * ��������� ������������ �� ������
		 * @param {String} str
		 * @return {String} ������������ ��� ������ ������
		 */
		extractAbbreviation: function(str) {
			var cur_offset = str.length,
				start_index = -1;
			
			while (true) {
				cur_offset--;
				if (cur_offset < 0) {
					// ����� �� ������ ������
					start_index = 0;
					break;
				}
				
				var ch = str.charAt(cur_offset);
				
				if (!isAllowedChar(ch) || (ch == '>' && isEndsWithTag(str.substring(0, cur_offset + 1)))) {
					start_index = cur_offset + 1;
					break;
				}
			}
			
			if (start_index != -1) 
				// ���-�� �����, ���������� ������������
				return str.substring(start_index);
			else
				return '';
		},
		
		/**
		 * ����������� ������������ � ������ ���������
		 * @param {String} abbr ������������
		 * @param {String} type ��� ��������� (xsl, html)
		 * @return {Tag}
		 */
		parseIntoTree: function(abbr, type) {
			type = type || 'html';
			var root = new Tag('', 1, type),
				parent = root,
				last = null,
				res = zen_settings[type],
				re = /([\+>])?([a-z][a-z0-9:\!\-]*)(#[\w\-\$]+)?((?:\.[\w\-\$]+)*)(?:\*(\d+))?/ig;
			
			if (!abbr)
				return null;
			
			// �������� ��������������� ��������
			abbr = abbr.replace(/([a-z][a-z0-9]*)\+$/i, function(str, tag_name){
				if ('expandos' in res)
					return res.expandos[tag_name] || str;
				else
					return str;
			});
			
			abbr = abbr.replace(re, function(str, operator, tag_name, id, class_name, multiplier){
				multiplier = multiplier ? parseInt(multiplier) : 1;
				
				var current = isShippet(tag_name, type) ? new Snippet(tag_name, multiplier, type) : new Tag(tag_name, multiplier, type);
				if (id)
					current.addAttribute('id', id.substr(1));
				
				if (class_name) 
					current.addAttribute('class', class_name.substr(1).replace(/\./g, ' '));
				
				
				// ��������� ������ ������
				if (operator == '>' && last)
					parent = last;
					
				parent.addChild(current);
				
				last = current;
				return '';
			});
			
			// ���� � abbr ������ ������ � ������, ��� ������������ ��� ������� 
			// ���� ������������� � ������, ���� ���, �� ������������ ���� �� ��������
			return (!abbr) ? root : null;
		},
		
		/**
		 * �������� ����� ���������
		 * @param {String} text �����, ������� ����� ������
		 * @param {String|Number} pad ���������� �������� ��� ��� ������
		 * @return {String}
		 */
		padString: padString,
		getNewline: getNewline,
		
		/**
		 * ���� ����� ����� ������� �������
		 * @param {Number} ��������� ������: -1 � ���� �����, 1 � ���� ������
		 * @param {Number} ��������� �������� ������������ ������� ������� �������
		 * @return {Number} ������ -1, ���� �� ���� ������� ����� �������
		 * -----
		 * � TopStyle �� ������������.
		 * ������ ��������������� ���������� ������������� � ����� ������ ��������� ������� "|".
		 */
		findNewEditPoint: function(inc, offset) {
			return -1
		},
		
		/**
		 * ���������� ��� �������� ��������� (css ��� html)
		 * @return {String|null}
		 * -----
		 * TopStyle ������������ ������ XHTML, ASP[VB], PHP, CFML, JSP
		 */
		getEditorType: function() {
			return 'html'
			/* return !(ts.isXHTML() || ts.isASP() || ts.isASP_VB() || ts.isPHP() || ts.isCFML() || ts.isJSP())
				? 'css'
				: 'html'
			*/
		},
		
		/**
		 * ���������� ������ ������� ������ � ���������
		 * @return {String}
		 */
		getCurrentLinePadding: function() {
			return (ts.getSelection().match(/^(\s+)/) || [''])[0]
		}
	}
})();		
