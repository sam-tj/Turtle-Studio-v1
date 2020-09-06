
goog.require('Blockly.Arduino');
goog.provide('Blockly.Arduino.turtle');

var _get_next_pin = function (dropdown_pin) {
    var pos = -1;
    //check if NextPIN in bound
    if (isNaN(parseInt(dropdown_pin))) {
        var NextPIN = 'A' + (parseInt(dropdown_pin.slice(1, dropdown_pin.length)) + 1);
        pos = profile.default.analog.indexOf(String(NextPIN));
    } else {
        var NextPIN = parseInt(dropdown_pin) + 1;
        pos = profile.default.digital.indexOf(String(NextPIN));
    }
    if (pos < 0) {
        alert("Grove Sensor needs PIN#+1 port, current setting is out of bound.");
        return null;
    } else {
        return NextPIN;
    }
};

Blockly.Arduino['turtle_button'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    Blockly.Arduino.setups_['setup_button_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
    var code = 'digitalRead(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['turtle_led'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var dropdown_stat = block.getFieldValue('STAT');
    Blockly.Arduino.setups_['setup_red_led_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
    var code = 'digitalWrite(' + dropdown_pin + ',' + dropdown_stat + ');\n'
    return code;
};

Blockly.Arduino['turtle_rgb_led'] = function (block) {
    var dropdown_pin1 = block.getFieldValue('PIN1');
    var dropdown_pin2 = block.getFieldValue('PIN2');
    var dropdown_pin3 = block.getFieldValue('PIN3');
    var dropdown_stat1 = block.getFieldValue('STAT1');
    var dropdown_stat2 = block.getFieldValue('STAT2');
    var dropdown_stat3 = block.getFieldValue('STAT3');
    Blockly.Arduino.setups_['setup_red_led_' + dropdown_pin1] = 'pinMode(' + dropdown_pin1 + ', OUTPUT);';
    Blockly.Arduino.setups_['setup_green_led_' + dropdown_pin2] = 'pinMode(' + dropdown_pin2 + ', OUTPUT);';
    Blockly.Arduino.setups_['setup_blue_led_' + dropdown_pin3] = 'pinMode(' + dropdown_pin3 + ', OUTPUT);';
    var code = 'digitalWrite(' + dropdown_pin1 + ',' + dropdown_stat1 + ');\n'
     code += 'digitalWrite(' + dropdown_pin2 + ',' + dropdown_stat2 + ');\n'
     code += 'digitalWrite(' + dropdown_pin3 + ',' + dropdown_stat3 + ');\n'
    return code;
};


Blockly.Arduino['turtle_piezo_buzzer'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var dropdown_stat = block.getFieldValue('STAT');
    Blockly.Arduino.setups_['setup_piezo_buzzer_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
    var code = 'digitalWrite(' + dropdown_pin + ',' + dropdown_stat + ');\n'
    return code;
};

Blockly.Arduino['turtle_ldr_sensor'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var code = 'analogRead(' + dropdown_pin + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['turtle_i2c_lcd_print'] = function (block) {
    var dropdown_pin = block.getFieldValue('PIN');
    var text = Blockly.Arduino.valueToCode(block, 'TEXT1',
            Blockly.Arduino.ORDER_UNARY_POSTFIX) || '\'\'';
    var text2 = Blockly.Arduino.valueToCode(block, 'TEXT2',
            Blockly.Arduino.ORDER_UNARY_POSTFIX) || '\'\'';
    var delay_time = Blockly.Arduino.valueToCode(block, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000';
    /*if(text.length>16||text2.length>16){
     alert("string is too long");
     }*/    
    Blockly.Arduino.definitions_['define_softwareserial'] = '#include <SoftwareSerial.h>\n';
    Blockly.Arduino.definitions_['define_i2clcd'] = '#include <LiquidCrystal_I2C.h>\n';
    //generate PIN#+1 port
    var NextPIN = _get_next_pin(dropdown_pin);

    Blockly.Arduino.definitions_['var_lcd_' + dropdown_pin] = 'LiquidCrystal_I2C lcd(0x27, 16, 2); // SDA '+dropdown_pin + ' , SCL ' + NextPIN+'\n';

    Blockly.Arduino.setups_['setup_lcd_' + dropdown_pin] = 'lcd.begin();\n';
    var code = 'lcd.backlight();\n';
    code += 'lcd.setCursor(0,0);\n';
    code += 'lcd.print(' + text + ');\n'; //text.replace(new RegExp('\'',"gm"),'')
    code += 'lcd.setCursor(0,1);\n';
    code += 'lcd.print(' + text2 + ');\n';
    code += 'delay(' + delay_time + ');\n';
    return code;
};