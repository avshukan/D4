(function(){
    'use strict';
    angular
        .module('RegPortal')
        .factory('TalonAmbModelFactoryD2', [
            TalonAmbModelFactoryD2
        ]);

    function TalonAmbModelFactoryD2(){
        const date = new Date().toLocaleString().split(',')[0];
        function newSL(lpuCode) {
            return Object.assign({},{
                "sl_id": "0",
                "vid_hmp": "0",
                "metod_hmp": "0",
                "lpu_1": lpuCode,
                "podr": null,
                "profil": "0",
                "profil_k": null,
                "det": "0",
                "tal_d": date,
                "tal_num": "00.0000.00000.000",
                "tal_p": date,
                "nhistory": "0",
                "date_1": date,
                "date_2": date,
                "ds0": null,
                "ds1": "0",
                "ds2": null,
                "ds3": null,
                "c_zab": null,
                "ds_onk": "0",
                "code_mes1": null,
                "code_mes2": null,
                "napr": [],
                "cons": [],
                "onk_sl": [],
                "ksg_kpg": null,
                "prvs": "0",
                "vers_spec": "V021",
                "iddokt": "0",
                "ed_col": null,
                "tarif": null,
                "sum_m": "0.00",
                "usl": [],
                "comentsl": null
            });
        }
        

        return {

            new: (lpuCode) => {
                return Object.assign({}, {
                    "zl_list": {
                        "zglv": {
                            "version": "0",
                            "data": "1967-08-13",
                            "filename": "D2",
                            "sd_z": "0"
                        },
                        "schet": {
                            "code": "0",
                            "code_mo": "0",
                            "year": "0",
                            "month": "0",
                            "nschet": "0",
                            "dschet": date,
                            "plat": null,
                            "summav": "0.00",
                            "coments": "D2",
                            "summap": null,
                            "sank_mek": null,
                            "sank_mee": null,
                            "sank_ekmp": null
                        },
                        "zap": {
                            "n_zap": "0",
                            "pr_nov": "0",
                            "pacient": {
                                "id_pac": "0",
                                "vpolis": "0",
                                "spolis": null,
                                "npolis": "0",
                                "st_okato": null,
                                "smo": null,
                                "smo_ogrn": null,
                                "smo_ok": null,
                                "smo_nam": null,
                                "inv": null,
                                "mse": null,
                                "novor": "0",
                                "vnov_d": null
                            },
                            "z_sl": {
                                "idcase": "0",
                                "usl_ok": "0",
                                "vidpom": "0",
                                "for_pom": "0",
                                "npr_mo": null,
                                "npr_date": null,
                                "lpu": lpuCode,
                                "date_z_1": date,
                                "date_z_2": date,
                                "kd_z": null,
                                "vnov_m": null,
                                "rslt": "0",
                                "ishod": "0",
                                "os_sluch": null,
                                "vb_p": null,
                                "sl": [newSL(lpuCode)],
                                "idsp": "00",
                                "sumv": "0.00",
                                "oplata": "0"
                            }
                        }
                    },
                    "_pacient": {
                        "id_pac": "",
                        "fam": null,
                        "im": null,
                        "ot": null,
                        "w": "0",
                        "dr": date,
                        "dost": null,
                        "tel": null,
                        "fam_p": null,
                        "im_p": null,
                        "ot_p": null,
                        "w_p": null,
                        "dr_p": null,
                        "dost_p": null,
                        "mr": null,
                        "doctype": null,
                        "docser": null,
                        "docnum": null,
                        "snils": null,
                        "okatog": null,
                        "okatop": null,
                        "comentp": null
                    }
                })
            },

            newSL: newSL,

            newPatient: () => {
                return Object.assign({}, {
                    "id_pac": "",
                    "fam": null,
                    "im": null,
                    "ot": null,
                    "w": "0",
                    "dr": date,
                    "dost": null,
                    "tel": null,
                    "fam_p": null,
                    "im_p": null,
                    "ot_p": null,
                    "w_p": null,
                    "dr_p": null,
                    "dost_p": null,
                    "mr": null,
                    "doctype": null,
                    "docser": null,
                    "docnum": null,
                    "snils": null,
                    "okatog": null,
                    "okatop": null,
                    "comentp": null
                });
            }
        };

    }
})(); 
