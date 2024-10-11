/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon="" block="LEDバー"
namespace IMLledbar {

    // LEDバーの制御ピンの設定
    let dataPin = DigitalPin.P1
    let clockPin = DigitalPin.P2

    //% block="ピンを設定する %pin"
    //% weight=100   
    export function SetPin(pin: DigitalPin) {
        setpin(pin)
    }

    //% block="バーを点灯する %level"
    //% weight=100   
    export function SetLedBar(level: number) {
        setLevel(level)
    }

    function setpin(pin: DigitalPin) {
        switch (pin) {
            case DigitalPin.P0:
                clockPin = DigitalPin.P1
                dataPin = DigitalPin.P0
                break;
            case DigitalPin.P1:
                clockPin = DigitalPin.P2
                dataPin = DigitalPin.P1
                break;
            case DigitalPin.P2:
                clockPin = DigitalPin.P12
                dataPin = DigitalPin.P2
                break;
            case DigitalPin.P15:
                clockPin = DigitalPin.P16
                dataPin = DigitalPin.P15
                break;
        }
    }

    // データラッチの制御
    function latch() {
        pins.digitalWritePin(dataPin, 0)
        control.waitMicros(1)
        for (let i = 0; i < 4; i++) {
            pins.digitalWritePin(dataPin, 1)
            pins.digitalWritePin(dataPin, 0)
        }
        control.waitMicros(1)
    }

    // 16ビットのデータ送信
    function write16(data: number) {
        let state = pins.analogReadPin(clockPin)
        for (let i = 15; i >= 0; i--) {
            pins.digitalWritePin(dataPin, (data >> i) & 1)
            state = (state == 1) ? 0 : 1
            pins.digitalWritePin(clockPin, state)
        }
    }

    // LEDバーの初期化
    function begin() {
        write16(0) // コマンド：8ビットモードの設定
    }

    // LEDバーの終了
    function end() {
        write16(0) // 余分な2つのチャンネルで208ビットシフトレジスタを埋める
        write16(0)
        latch()
    }

    // LEDバーの点灯レベルを設定
    function setLevel(level: number) 
    {
        let val = Math.floor( level/10 )
        let brightness = level % 10
        begin()
        for (let i = 0 ; i < 10 ; i++) {
            write16(val > i ? brightness : 0)
        }        
        end()
    }
}
