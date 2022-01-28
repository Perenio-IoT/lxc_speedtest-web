import JsonRpc from "./JsonRpc/JsonRpc.js";

export default class Translator {

    static source;

    static async run() {

        this.source = await this._getTranslations();

        this.isLogin() && (this.currentLang = await this.getHostLang());

        this.doTranslate();
    }

    static isLogin() {
        return location.pathname == '/cgi-bin/luci';
    }

    /**
     * Translate elements with data attribute data-translate
     */
    static doTranslate() {

        const fields = document.querySelectorAll(`[data-translate]`);

        for (let field of fields)
            if (!!this.source[this.currentLang][field.dataset.translate])
                field.innerHTML = this.source[this.currentLang][field.dataset.translate];
    }

    static async getHostLang() {
        
        const host_lang = await JsonRpc.requestIntoSYS('exec', `ubus call host request '{"path":"uci","cmd":"get","arg": {"config":"luci","section":"main","option":"lang"} }'`);

        return host_lang.value;
    }

    static set currentLang(val) {
        window.localStorage.setItem('lang', val);
    }

    static get currentLang() {
        return window.localStorage.getItem('lang') ;
    }

    static getPhrase(key) {

        return !!this.source[this.currentLang][key] ?
            this.source[this.currentLang][key]
            :
            `${key}`;
    }

    static _getTranslations() {
        return window.fetch('/luci-static/resources/json/translations.json', { cache: "no-store" }).then(d => d.json());
    }
}