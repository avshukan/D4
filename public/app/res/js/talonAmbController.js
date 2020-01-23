(function() {
    'use strict';
    angular
        .module('RegPortal')
        .controller('TalonAmbController', [
            '$cookies',
            'ApiFactory',
            'NsiFactory',
            'CheckModelFactory',
            'TalonAmbModelFactory',
            'CheckRecords',
            TalonAmbController
        ]);

    function TalonAmbController($cookies, ApiFactory, NsiFactory, CheckModelFactory, TalonAmbModelFactory, CheckRecords) {
        const vm = this;




        vm.refBooksDinamic = {
            ds0: {
                mkb10: []
            },
            ds1: {
                mkb10: []
            },
            ds2: {
                mkb10: []
            },
            ds3: {
                mkb10: []
            },
            usls: [],
            uslsReg: []
        };

        vm.slIndex = 0;
        vm.records = [];
        vm.doctors = [];
        vm.refBooks = {};
        vm.nsi = NsiFactory;
        vm.lpu = $cookies.get('lpu');
        vm.selectedTalonsId = [];
        vm.isDS_Onk_Message = '';

        vm.checkEditorModel = CheckModelFactory.new(vm.lpu, 'D4');
        vm.talonEditorModel = TalonAmbModelFactory.new(vm.lpu);
        vm.patientEditorModel = {};
        vm.selectedTalonId = null;
        vm.selectedServiceTarif = null;
        vm.consiliumEditorModel = {};


        console.log($cookies.get('lpu'));

        vm.init = init;
        vm.addSL = addSL;
        vm.getKD = getKD;
        vm.delSL = delSL;
        vm.clearDS = clearDS;
        vm.getUsls = getUsls;
        vm.setDate = setDate;
        vm.getKD_Z = getKD_Z;
        vm.setVB_P = setVB_P;
        vm.newTalon = newTalon;
        vm.isDS_Onk = isDS_Onk;
        vm.getMKB10 = getMKB10;
        vm.clearZsl = clearZsl;
        vm.nullCrit = nullCrit;
        vm.calcNovor = calcNovor;
        vm.getUslsReg = getUslsReg;
        vm.getDSLabel = getDSLabel;
        vm.recordSave = recordSave;
        vm.setSlIndex = setSlIndex;
        vm.checkDate2 = checkDate2;
        vm.newEmptySL = newEmptySL;
        vm.toKsgEditor = toKsgEditor;
        vm.checkDateZ2 = checkDateZ2;
        vm.cloneRecord = cloneRecord;
        vm.getZlDate_1 = getZlDate_1;
        vm.getZlDate_2 = getZlDate_2;
        vm.readRecords = readRecords;
        vm.readPatient = readPatient;
        vm.getRefBooks = getRefBooks;
        vm.checkRecords = checkRecords;
        vm.calcUslTarif = calcUslTarif;
        vm.setPacientId = setPacientId;
        vm.selectDoctor = selectDoctor;
        vm.calcCheckSumm = calcCheckSumm;
        vm.toTalonEditor = toTalonEditor;
        vm.selectTalonId = selectTalonId;
        vm.calcTotalSumm = calcTotalSumm;
        vm.selectUslTarif = selectUslTarif;
        vm.toChecksEditor = toChecksEditor;
        vm.isNaprRequered = isNaprRequered;
        vm.selectDoctorUsl = selectDoctorUsl;
        vm.isSelectedTalon = isSelectedTalon;
        vm.checkDiffKD_KDZ = checkDiffKD_KDZ;
        vm.popServiseTarif = popServiseTarif;
        vm.getSMOIdDefault = getSMOIdDefault;
        vm.isOnk_SLRequered = isOnk_SLRequered;
        vm.pushServiseTarif = pushServiseTarif;
        vm.getDoctorUslName = getDoctorUslName;
        // vm.getSpecialization = getSpecialization;
        vm.clearUslTarifSumm = clearUslTarifSumm;
        vm.isConsiliumRequered = isConsiliumRequered;
        vm.getSpecializationName = getSpecializationName;
        vm.emptyTalonEditorModel = emptyTalonEditorModel;
        vm.emptyCheckEditorModel = emptyCheckEditorModel;
        vm.getSpecializationUslName = getSpecializationUslName;

        vm.alerts = {
            check: false,
            doctor: false
        }

        vm.filters = {
            talonList: {
                _pacient: {
                    ds: '',
                    fam: '',
                    snils: '',
                    npolis: '',
                    idbars: ''
                },
                _doctor: {
                    lastname: ''
                }
            },
            doctorSelect: {
                id: '',
                name: '',
                snils: '',
                lastname: ''
            },
            refBooksDinamic: {
                ds0: {
                    mkb10: ''
                },
                ds1: {
                    mkb10: ''
                },
                ds2: {
                    mkb10: ''
                },
                ds3: {
                    mkb10: ''
                },
                ds4: {
                    mkb10: ''
                }
            },
            talonEditorModel: {
                zsl: false,
                rslt: '',
                rmp_id: '',
                mkb_id: '',
                novor: false,
                mkb_name: '',
                p_cel_id: '',
                p_cel_name: '',
                ishod_id: '',
                ishod_name: ''
            },
            uslEditorModel: {
                code: '',
                name: ''
            },
            uslsReg: {
                code: '',
                name: ''
            }
        };
        //uslEditorModel.code_usl
        function init() {
            vm.apiDoctors.read()
            vm.apiChecks.read();
            vm.isDS_Onk();
            vm.getUsls();
            vm.getRefBooks(['V002', 'V020', 'V025', 'V027', 'V021', 'V028', 'V029', 'V006', 'V008', 'V014', 'V009', 'V012', 'V010']);
        }


        const ApiFactoryMethods = function(apiFactory, collectionName, scopeArrayName, scopeDataObjectName, scopeSelectedIds) {
            this.url = function(url, callback) {
                apiFactory.read(url)
                    .then((res) => { callback(res.data); },
                        (res) => { console.error(res); });
            }

            this.read = function() {
                apiFactory.read([collectionName])
                    .then((res) => { vm[scopeArrayName] = res.data; },
                        (res) => { console.error(res); });
            }

            this.readManyUrl = function(url, toCollection, callback) {
                apiFactory.read(url)
                    .then((res) => {
                            if (toCollection) { vm[collectionName] = res.data };
                            if (callback) { callback(res.data); }
                        },
                        (res) => { console.error(res); });
            }

            this.readOne = function(id, model, callback) {
                apiFactory.read([collectionName, id])
                    .then((res) => {
                            const resData = res.data.slice();
                            vm[model] = res.data.pop();
                            if (callback) { callback(resData); }
                        },
                        (res) => { console.error(res); });
            }

            this.create = function(callbackError, callbackSuccess) {
                apiFactory.create([collectionName], vm[scopeDataObjectName])
                    .then((res) => {
                            if (callbackSuccess) { callbackSuccess(res); }
                            vm[scopeArrayName] = res.data;
                        },
                        (res) => {
                            if (callbackError) { callbackError(res); }
                            console.error(res);
                        }
                    );
            }

            this.update = function(callbackError, callbackSuccess) {
                apiFactory.update([collectionName, vm[scopeDataObjectName]._id], vm[scopeDataObjectName])
                    .then((res) => {
                            if (callbackSuccess) { callbackSuccess(res); }
                            vm[scopeArrayName] = res.data;
                        },
                        (res) => {
                            if (callbackError) { callbackError(res); }
                            console.error(res);
                        }
                    );
            }

            this.delete = function(callbackError, callbackSuccess) {
                function _delete(id) {
                    apiFactory.delete([collectionName, id], vm[scopeDataObjectName]._id)
                        .then((res) => {
                                if (callbackSuccess) { callbackSuccess(res); }
                            },
                            (res) => {
                                if (callbackError) { callbackError(res); }
                                console.error(res);
                            }
                        );
                }

                if (vm[scopeSelectedIds] != undefined && vm[scopeSelectedIds].length != 0) {
                    vm[scopeSelectedIds].forEach(_delete);
                } else {
                    _delete(vm[scopeDataObjectName]._id);
                }
            }

            this.save = function(callbackError, callbackSuccess) {
                if (vm[scopeDataObjectName]._id) {
                    this.update(callbackError, callbackSuccess);
                } else {
                    this.create(callbackError, callbackSuccess);
                }
            }
        }



        vm.apiChecks = new ApiFactoryMethods(ApiFactory, 'checks', 'checks', 'checkEditorModel', 'selectedTalonsId');
        vm.apiRecords = new ApiFactoryMethods(ApiFactory, 'records', 'records', 'talonEditorModel', 'selectedTalonsId');
        vm.apiDoctors = new ApiFactoryMethods(ApiFactory, 'doctors', 'doctors', 'doctorEditorModel', 'selectedTalonsId');
        vm.apiPatient = new ApiFactoryMethods(ApiFactory, 'patients', 'patients', 'patientEditorModel', 'selectedTalonsId');
        vm.apiRefBooks = new ApiFactoryMethods(ApiFactory, 'refbooks', 'refbooks', 'refbooksEditorModel', 'selectedTalonsId');

        function checkRecords() {
            CheckRecords.check(vm.records);
        }

        function delSL() {
            if (vm.talonEditorModel.zl_list.zap.z_sl.sl.length > 1) {
                vm.talonEditorModel.zl_list.zap.z_sl.sl = vm.talonEditorModel.zl_list.zap.z_sl.sl.filter((sl, index) => {
                    return index != vm.slIndex;
                });
                vm.slIndex = 0;
            }
        }

        function clearDS(dsN) {
            vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex][dsN] = '';
        }

        function nullCrit() {
            vm.critEditorModel.crit = 'Нет';
        }

        function clearUslTarifSumm() {
            vm.uslEditorModel.tarif = null;
            vm.uslEditorModel.sumv_usl = "0.00";
        }

        // +
        function getUslsReg() {
            const code = vm.filters.uslsReg.code,
                name = vm.filters.uslsReg.name;
            vm.apiRecords.url(['refbooks', `search?name=USL_REG&uslCode=${code}&uslName=${name}`], (data) => {
                vm.refBooksDinamic.uslsReg = data;
            });
        }

        function getDSLabel(ds) {
            const label = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex][ds];
            return (label != undefined && label != null && label != 0 && label != '' && label && '0') ? label : 'Нет';
        }

        // +
        function selectUslTarif() {
            const uslCode = vm.uslEditorModel.code_usl;
            const tarif = vm.refBooksDinamic.usls.filter((usl) => {
                return usl.usl.code == uslCode;
            }).pop().tarif;
            vm.uslEditorModel.tarif = `${tarif.price}.00`;
            vm.uslEditorModel.sumv_usl = `${tarif.price}.00`;
        }

        function calcUslTarif() {
            const summ = parseFloat(vm.uslEditorModel.tarif) * parseFloat(vm.uslEditorModel.kol_usl);
            vm.uslEditorModel.sumv_usl = summ.toFixed(2);;
        }


        function newTalon() {
            vm.TalonAmbModelFactory.new(vm.lpu);
        }

        function isOnk_SLRequered() {
            const lenght = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].napr.length;
            const ds_onk = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ds_onk;
            const usl_ok = vm.talonEditorModel.zl_list.zap.z_sl.usl_ok;
            const reab = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].reab;
            return ((isDS_Onk() && ds_onk != '1' && reab != '1' && usl_ok != '4') && lenght < 1) ? 'badge-danger' : 'badge-light';
        }

        function isNaprRequered() {
            const lenght = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].napr.length;
            const ds_onk = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ds_onk;
            return ((isDS_Onk() || ds_onk == '1') && lenght < 1) ? 'badge-danger' : 'badge-light';
        }

        function isConsiliumRequered() {
            const lenght = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].cons.length;
            return (isDS_Onk() && lenght < 1) ? 'badge-danger' : 'badge-light';
        }

        // +
        function getDs(name, id) {
            return vm.refBooksDinamic[name].mkb10.filter((mkb) => {
                return mkb.IDDS == id;
            }).pop();
        }

        function isDS_Onk() {
            const ds1 = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ds1,
                ds2 = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ds2;

            if (getDs('ds1', ds1) != undefined) {
                if ((getDs('ds1', ds1).isDS_ONK == '1' || getDs('ds1', ds1).isDS_ONK == '2')) {
                    vm.isDS_Onk_Message = 'Онкологический диагноз';
                    return true;
                }
            }



            if (getDs('ds2', ds2) != undefined) {
                if ((getDs('ds1', ds1).isDS_ONK == '3' && getDs('ds2', ds2).isDS_ONK == '2')) {
                    vm.isDS_Onk_Message = 'Онкологический диагноз';
                    return true;
                }
            }


            vm.isDS_Onk_Message = 'Не онкологический диагноз';
            return false;
        }


        function setVB_P() {
            vm.talonEditorModel.zl_list.zap.z_sl.vb_p = null;
        }


        function getSMOIdDefault() {
            vm.talonEditorModel.zl_list.zap.pacient.smo = '65001';
            vm.talonEditorModel.zl_list.zap.pacient.smo_nam = '65001';
            vm.talonEditorModel.zl_list.zap.pacient.smo_ok = '64000';
            vm.talonEditorModel.zl_list.zap.pacient.smo_ogrn = '1027739008440';
        }


        function getDate(strDate) {
            if (strDate != undefined) {
                if (strDate.length > 0) {
                    const arrDate = strDate.split('.').map((d) => parseInt(d));
                    if (arrDate.length > 0) {
                        const date = new Date(arrDate[2], arrDate[1] - 1, arrDate[0]);
                        return date;
                    }
                }
            }

        }


        function checkDiffKD_KDZ() {
            const diff = parseInt(vm.talonEditorModel.zl_list.zap.z_sl.kd_z) < parseInt(vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].kd);

            return (diff) ? 'bg-danger text-white border-danger' : '';
        }

        function getKD() {
            const date_1 = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].date_1;
            const date_2 = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].date_2;
            let diff = 0;

            if (vm.talonEditorModel.zl_list.zap.z_sl.usl_ok == '1') {
                diff = Math.abs(getDate(date_1).getDate() - getDate(date_2).getDate());
            }
            if (vm.talonEditorModel.zl_list.zap.z_sl.usl_ok == '2') {
                diff = (Math.abs(getDate(date_1).getDate() - getDate(date_2).getDate())) + 1;
            }
            vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].kd = diff;

        }

        function getKD_Z() {
            const date_1 = vm.talonEditorModel.zl_list.zap.z_sl.date_z_1;
            const date_2 = vm.talonEditorModel.zl_list.zap.z_sl.date_z_2;
            let diff = 0

            if (vm.talonEditorModel.zl_list.zap.z_sl.usl_ok == '1') {
                diff = Math.abs(getDate(date_1).getDate() - getDate(date_2).getDate());
            }
            if (vm.talonEditorModel.zl_list.zap.z_sl.usl_ok == '2') {
                diff = (Math.abs(getDate(date_1).getDate() - getDate(date_2).getDate())) + 1;
            }
            vm.talonEditorModel.zl_list.zap.z_sl.kd_z = diff;

        }

        function checkDateZ2() {
            const date_1 = vm.talonEditorModel.zl_list.zap.z_sl.date_z_1;
            const date_2 = vm.talonEditorModel.zl_list.zap.z_sl.date_z_2;

            return getDate(date_1) > getDate(date_2);

        }

        function checkDate2() {
            const date_1 = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].date_1;
            const date_2 = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].date_2;

            return getDate(date_1) > getDate(date_2);
        }

        // + 
        function getMKB10(dsName) {
            const mkbCode = vm.filters.refBooksDinamic[dsName].mkb10;
            vm.apiRecords.url(['refbooks', `search?name=MKB10&IDDS=${mkbCode}`], (data) => {
                vm.refBooksDinamic[dsName].mkb10 = data;
            });
        }


        function cloneRecord(_id) {
            vm.apiRecords.url(['records', 'clone', _id], (data) => {
                vm.readRecords();
            });
        }

        function calcCheckSumm(_id) {
            vm.apiChecks.url(['checks', 'calc', _id], (data) => {
                vm.checks = data;
            });
        }

        function calcTotalSumm() {
            const sumv = vm.talonEditorModel.zl_list.zap.z_sl.sl.reduce((acc, sl) => {
                return acc += parseFloat(sl.sum_m);
            }, 0.0);

            vm.talonEditorModel.zl_list.zap.z_sl.sumv = parseFloat(sumv).toFixed(2);
        }

        function calcNovor() {
            if (vm.talonEditorModel._pacient.w.length > 0 && vm.talonEditorModel._pacient.dr.length > 0) {
                const p = vm.talonEditorModel._pacient.w;
                const dr = vm.talonEditorModel._pacient.dr.split('.').map(a => a.slice(-2).padStart(2, '0'));
                vm.talonEditorModel.zl_list.zap.pacient.novor = `${p}${dr[0]}${dr[1]}${dr[2]}1`;
            }
        }

        function addSL() {
            vm.talonEditorModel.zl_list.zap.z_sl.sl.push(TalonAmbModelFactory.newSL(vm.lpu));
            //vm.newEmptySL();
        }

        function setSlIndex(index) {
            vm.newEmptySL();
            vm.slIndex = index;
            vm.toKsgEditor();
        }

        function getUsls() {
            if (vm.lpu) {
                vm.apiRefBooks.readManyUrl(['refbooks', 'usl', `?lpu=${vm.lpu}`], null, (res) => {
                    vm.refBooksDinamic.usls = res;
                });
            }
        }


        function getRefBooks(refbooks) {
            refbooks.forEach((refBook) => {
                const date_z_2 = vm.talonEditorModel.zl_list.zap.z_sl.date_z_2;
                vm.apiRefBooks.readManyUrl(['refbooks', 'query', `?name=${refBook}&date_z_2=${date_z_2}`], null, (res) => {
                    if (!vm.refBooks[refBook]) {
                        vm.refBooks[refBook] = res;
                    }
                });
            });
        }

        function recordSave() {
            if (vm.talonEditorModel.zl_list.schet._id &&
                vm.talonEditorModel._doctor._id) {
                vm.apiRecords.save((res) => {
                    $('#toastRecord_Error').toast('show');
                }, (res) => {
                    $('#toastRecord_Success').toast('show');
                });
            }
        }

        function readRecords() {
            const url = ['records', 'check', vm.checkEditorModel._id];
            vm.apiRecords.readManyUrl(url, 'records');
        }

        function readPatient(prop) {
            let id = '';
            if (prop == 'id') {
                id = vm.talonEditorModel.zl_list.zap.pacient.id_pac;
            }

            if (prop == 'snils') {
                id = vm.talonEditorModel._pacient.snils;
            }

            vm.apiPatient.readOne(id, 'patientEditorModel', (res) => {
                // console.log(res);
                if (res.length > 0) {
                    vm.talonEditorModel._pacient.w = vm.patientEditorModel.w;
                    vm.talonEditorModel._pacient.dr = vm.patientEditorModel.dr;
                    vm.talonEditorModel._pacient.ot = vm.patientEditorModel.ot;
                    vm.talonEditorModel._pacient.im = vm.patientEditorModel.im;
                    vm.talonEditorModel._pacient.fam = vm.patientEditorModel.fam;
                    vm.talonEditorModel._pacient.snils = vm.patientEditorModel.snils;
                    vm.talonEditorModel._pacient.okatop = vm.patientEditorModel.okatop;
                    vm.talonEditorModel._pacient.docser = vm.patientEditorModel.docser;
                    vm.talonEditorModel._pacient.docnum = vm.patientEditorModel.docnum;
                    vm.talonEditorModel._pacient.doctype = vm.patientEditorModel.doctype;
                    vm.talonEditorModel.zl_list.zap.pacient.smo_nam = vm.patientEditorModel.restrah;
                    // vm.talonEditorModel.zl_list.zap.pacient.inv = vm.patientEditorModel.inv;
                    vm.talonEditorModel.zl_list.zap.pacient.vpolis = vm.patientEditorModel.vpolis;
                    vm.talonEditorModel.zl_list.zap.pacient.spolis = vm.patientEditorModel.spolis;
                    vm.talonEditorModel.zl_list.zap.pacient.npolis = vm.patientEditorModel.npolis;
                } else {
                    vm.talonEditorModel._pacient = TalonAmbModelFactory.newPatient();
                    vm.talonEditorModel.zl_list.zap.pacient.npolis = "0";
                    vm.talonEditorModel.zl_list.zap.pacient.vpolis = "0";
                    vm.talonEditorModel.zl_list.zap.pacient.smo = null;
                    vm.talonEditorModel.zl_list.zap.pacient.smo_nam = null;
                }

            });
        }

        function toDates(strDate) {
            const date = strDate.split('.').map(d => parseInt(d));
            return new Date(date[2], date[1] - 1, date[0]);
        }

        function getZlDate_1() {
            const date = vm.talonEditorModel.zl_list.zap.z_sl.sl.map((sl) => {
                return toDates(sl.date_1);
            }).sort((a, b) => { return (a < b) ? -1 : 1 })[0];
            vm.talonEditorModel.zl_list.zap.z_sl.date_z_1 = date.toLocaleDateString();
        }

        function getZlDate_2() {

            const date = vm.talonEditorModel.zl_list.zap.z_sl.sl.map((sl) => {
                return toDates(sl.date_2);
            }).sort((a, b) => { return (a > b) ? -1 : 1 })[0];
            vm.talonEditorModel.zl_list.zap.z_sl.date_z_2 = date.toLocaleDateString();
        }


        function checksToTalonEditorModel() {
            vm.talonEditorModel.zl_list.schet = vm.checkEditorModel;
        }

        function toChecksEditor(id, edit) {
            vm.checkEditorModel = vm.checks.filter((check) => {
                return check._id == id;
            }).pop();

            if (edit) {
                $('a[href~="#checkEditor_Tab_Editor"]').tab('show');
            }

            checksToTalonEditorModel();
        }

        function emptyCheckEditorModel() {
            vm.checkEditorModel = CheckModelFactory.new(vm.lpu, 'D4');
        }

        function selectDoctor(id) {
            const _doctor = vm.doctors.filter((doctor) => {
                return doctor._id == id;
            });

            if (_doctor != undefined) {
                const doctor = _doctor.pop();
                if (doctor != undefined) {
                    doctor.name = `${doctor.lastname} ${doctor.firstname} ${doctor.middlename}`;
                    vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].iddokt = doctor.snils;
                    vm.talonEditorModel._doctor = doctor;
                }
            }
        }

        function selectDoctorUsl(id) {
            const _doctor = vm.doctors.filter((doctor) => {
                return doctor._id == id;
            });

            if (_doctor != undefined) {
                const doctor = _doctor.pop();
                if (doctor != undefined) {
                    doctor.name = `${doctor.lastname} ${doctor.firstname} ${doctor.middlename}`;
                    vm.uslEditorModel.code_md = doctor.snils;
                }
            }
        }

        function getDoctorUslName() {
            const snils = vm.uslEditorModel.code_md;
            if (snils != undefined && snils != '') {
                const doctor = vm.doctors.filter((doctor) => {
                    return doctor.snils == snils;
                }).pop();

                if (doctor != undefined) {
                    doctor.lastname = (doctor.lastname) ? doctor.lastname : '';
                    doctor.firstname = (doctor.firstname) ? doctor.firstname : '';
                    doctor.middlename = (doctor.middlename) ? doctor.middlename : '';
                    return `${doctor.lastname} ${doctor.firstname} ${doctor.middlename}`;
                }
            }
            return '';
        }

        function getSpecializationUslName() {
            if (vm.uslEditorModel.prvs != undefined && vm.uslEditorModel.prvs != '') {
                const _prvs = vm.nsi.V021.list.filter((prvs) => {
                    return prvs.id == vm.uslEditorModel.prvs;
                });

                if (_prvs != undefined) {
                    const prvs = _prvs.pop();
                    if (prvs != undefined) {
                        return prvs.name;
                    }
                }
            }
            return '';
        }

        // Для удаления ошибок с фильтром
        // function getSpecialization(V021) {
        //     if (V021 != undefined) {
        //         return `${V021.id} - ${V021.name}`;
        //     }
        //     return 'Нет специальности с таким кодом';
        // }


        function emptyTalonEditorModel() {
            const checkId = vm.checkEditorModel._id;
            vm.slIndex = 0;
            const doctor = Object.assign({}, vm.talonEditorModel._doctor);
            vm.talonEditorModel = JSON.parse(angular.toJson(TalonAmbModelFactory.new(vm.lpu)));
            vm.talonEditorModel._doctor = doctor;

            if (checkId) {
                vm.toChecksEditor(checkId, false);
            }


            // Clear submodels
            vm.ksgEditor.new();
            vm.uslEditor.new();
            vm.critEditor.new();
            vm.slkoefEditor.new();
            vm.onkoDragEditor.new();
            vm.onkoDiagEditor.new();
            vm.consiliumEditor.new();
            vm.onkoEventEditor.new();
            vm.onkoServiceEditor.new();
            vm.onkoRejectionEditor.new();
            vm.consiliumEditor.new();
        }

        function newEmptySL() {
            vm.ksgEditor.new();
            vm.uslEditor.new();
            vm.critEditor.new();
            vm.slkoefEditor.new();
            vm.onkoDragEditor.new();
            vm.onkoDiagEditor.new();
            vm.consiliumEditor.new();
            vm.onkoEventEditor.new();
            vm.onkoServiceEditor.new();
            vm.onkoRejectionEditor.new();
            vm.consiliumEditor.new();
        }

        function toKsgEditor() {
            if (vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg) {
                vm.ksgEditorModel["n_ksg"] = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.n_ksg;
                vm.ksgEditorModel["ver_ksg"] = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.ver_ksg;
                vm.ksgEditorModel["ksg_pg"] = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.ksg_pg;
                vm.ksgEditorModel["n_kpg"] = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.n_kpg;
                vm.ksgEditorModel["koef_z"] = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.koef_z;
                vm.ksgEditorModel["koef_up"] = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.koef_up;
                vm.ksgEditorModel["bztsz"] = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.bztsz;
                vm.ksgEditorModel["koef_d"] = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.koef_d;
                vm.ksgEditorModel["koef_u"] = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.koef_u;
                vm.ksgEditorModel["crit"] = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.crit;
                vm.ksgEditorModel["sl_k"] = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].sl_k;
                vm.ksgEditorModel["it_sl"] = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.it_sl;
                vm.ksgEditorModel["sl_koef"] = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.sl_koef;
            }
        }

        function selectTalonId(id) {
            if (!vm.selectedTalonsId.includes(id)) {
                pushSelectTalonId(id);
            } else {
                popSelectTalonId(id);
            }
        }

        function isSelectedTalon(id) {
            return vm.selectedTalonId == id;
        }

        function pushSelectTalonId(id) {
            vm.selectedTalonsId.push(id);
        }

        function popSelectTalonId(id) {
            vm.selectedTalonsId = vm.selectedTalonsId.filter((_id) => _id != id);
        }

        function toTalonEditor(id) {
            vm.slIndex = 0;
            vm.selectedTalonId = id;
            vm.talonEditorModel = vm.records.filter((talon) => {
                return talon._id == id;
            }).pop();

            if (vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg != null) {
                vm.ksgEditorModel = vm.talonEditorModel.zl_list.zap.z_sl.sl[0].ksg_kpg;
            }

            $('a[href~="#talonForm"]').tab('show');
        }


        function getSpecializationName() {
            if (vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].prvs &&
                vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].prvs != '' &&
                vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].prvs != '0') {
                if (vm.nsi.V021.list != undefined) {
                    const _spec = vm.nsi.V021.list.filter(function filterSpecialization(spec) {
                        return spec.id == vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].prvs;
                    });
                    if (_spec != undefined) {
                        const spec = _spec.pop();
                        return (spec != undefined) ? spec.name : '';
                    }

                }
            };
            return '';
        }

        function pushServiseTarif() {
            if (vm.selectedServiceTarif) {
                const serviceExists = vm.talonEditorModel.listUsluga.some((usluga) => {
                    return usluga.id == vm.selectedServiceTarif.id;
                });
                if (!serviceExists) {
                    vm.talonEditorModel.listUsluga.push(JSON.parse(angular.toJson(vm.selectedServiceTarif)));
                }
                vm.talonEditorModel.listUsluga = vm.talonEditorModel.listUsluga.map((usluga) => {
                    if (usluga.id == vm.selectedServiceTarif.id) {
                        usluga.kol_usl += 1;
                    }
                    return usluga;
                });
            }
        }

        function popServiseTarif(serviceIndex) {
            vm.talonEditorModel.listUsluga = vm.talonEditorModel.listUsluga.filter((usluga, index) => {
                return index != serviceIndex;
            });
        }

        function clearZsl() {
            if (!vm.talonEditorModel.obr) {
                vm.talonEditorModel.posNumber = '';
                vm.talonEditorModel.posDateFirst = '';
            }
        }

        function setDate(minusDay) {
            const date = new Date();
            date.setDate(date.getDate() - minusDay);

            const d = `${date.getDate()}`.padStart(2, '0'),
                m = `${date.getMonth() + 1}`.padStart(2, '0'),
                y = date.getFullYear();
            if (minusDay > 0) {
                vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].date_1 = `${d}.${m}.${y}`;
            }
            if (minusDay < 0) {
                vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].date_2 = `${d}.${m}.${y}`;
            }
            if (minusDay == 0) {
                vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].date_1 = `${d}.${m}.${y}`;
                vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].date_2 = `${d}.${m}.${y}`;
            }
        }

        function checkNovor() {
            if (vm.filters.talonEditorModel.novor === true) {
                vm.talonEditorModel.objPatient.novor = "TEST";
            }
        }

        function setPacientId() {
            vm.talonEditorModel._pacient.id_pac = vm.talonEditorModel.zl_list.zap.pacient.id_pac;
        }



        // ------------------------------- consiliumEditor 
        vm.consiliumEditor = {
            new: function() {
                vm.consiliumEditorModel = {
                    "pr_cons": "0",
                    "dt_cons": null
                }
            },

            pop: function() {
                const models = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].cons.filter((model) => {
                    return model._id != vm.consiliumEditorModel._id;
                });

                vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].cons = models;
                this.new();
            },

            push: function() {
                if (vm.consiliumEditorModel._id == undefined) {
                    const length = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].cons.length;
                    vm.consiliumEditorModel._id = length;
                    vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].cons.push(vm.consiliumEditorModel);
                    this.new();
                    //this.toEditor(length);
                }


            },

            toEditor: function(_id) {
                const model = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].cons.filter((model) => {
                    return model._id == _id;
                }).pop();

                vm.consiliumEditorModel = model;
                $('a[href~="#consiliumEditor_Tab_Editor"]').tab('show');
            }

        }






        // ------------------------------- onkoEventEditor
        function newOnkoEventEditorModel() {
            return (() => {
                // return Object.assign({}, {
                //     "ds1_t": "0",
                //     "stad": "0",
                //     "onk_t": "0",
                //     "onk_n": "0",
                //     "onk_m": "0",
                //     "mtstz": null,
                //     "sod": null,
                //     "b_diag": [],
                //     "b_prot": [],
                //     "onk_usl": []
                // }
                return Object.assign({}, {
                    "ds1_t": "0",
                    "stad": "",
                    "onk_t": "",
                    "onk_n": "",
                    "onk_m": "",
                    "mtstz": "",
                    "sod": "",
                    "k_fr": "",
                    "wei": "",
                    "hei": "",
                    "bsa": "",
                    "b_diag": [],
                    "b_prot": [],
                    "onk_usl": []
                });
            })();
        }

        vm.onkoEventEditorModel = newOnkoEventEditorModel();


        vm.onkoEventEditor = {
            new: function() {
                vm.onkoEventEditorModel = JSON.parse(angular.toJson(newOnkoEventEditorModel()));
            },

            pop: function() {
                const models = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl.filter((model) => {
                    return model._id != vm.onkoEventEditorModel._id;
                });

                vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl = models;
                this.new();
            },

            push: function() {
                if (vm.onkoEventEditorModel._id == undefined) {
                    const length = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl.length;
                    vm.onkoEventEditorModel._id = length;
                    vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl.push(vm.onkoEventEditorModel);
                    this.new();
                    // this.toEditor(length);
                }

            },

            toEditor: function(_id) {
                const model = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl.filter((model) => {
                    return model._id == _id;
                }).pop();

                vm.onkoEventEditorModel = model;
                $('a[href~="#onkoEventEditor_Tab_Editor"]').tab('show');
            }
        }


        // ------------------------------- orderEditor
        vm.orderEditorModel = angular.copy(Object.assign({}, {
            "napr_date": "1967-08-13",
            "napr_mo": null,
            "napr_v": "4",
            "met_issl": null,
            "napr_usl": null
        }));

        vm.orderEditor = {
            new: function() {

                vm.orderEditorModel = angular.copy(Object.assign({}, {
                    "napr_date": "1967-08-13",
                    "napr_mo": null,
                    "napr_v": "4",
                    "met_issl": null,
                    "napr_usl": null
                }));
            },

            pop: function() {
                const models = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].napr.filter((model) => {
                    return model._id != vm.orderEditorModel._id;
                });

                vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].napr = models;
                this.new();
            },

            push: function() {
                if (vm.orderEditorModel._id == undefined) {
                    const length = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].napr.length;
                    vm.orderEditorModel._id = length;
                    vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].napr.push(vm.orderEditorModel);
                    this.new();
                    //this.toEditor(length);
                }

            },

            toEditor: function(_id) {
                const model = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].napr.filter((model) => {
                    return model._id == _id;
                }).pop();

                vm.orderEditorModel = model;
                $('a[href~="#orderEditor_Tab_Editor"]').tab('show');
            }
        }


        // ------------------------------- onkoRejectionEditor
        vm.onkoRejectionEditorModel = angular.copy(Object.assign({}, {
            "prot": "0",
            "d_prot": new Date().toLocaleString().split(',')[0]
        }));

        vm.onkoRejectionEditor = {
            new: function() {
                vm.onkoRejectionEditorModel = angular.copy(Object.assign({}, {
                    "prot": "0",
                    "d_prot": new Date().toLocaleString().split(',')[0]
                }))
            },

            pop: function() {
                if (vm.onkoEventEditorModel._id != undefined) {
                    const index = parseInt(vm.onkoEventEditorModel._id);

                    const models = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].b_prot.filter((model) => {
                        return model._id != vm.onkoRejectionEditorModel._id;
                    });

                    vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].b_prot = models;
                    this.new();
                }
            },

            push: function() {
                if (vm.onkoEventEditorModel._id != undefined) {
                    const index = parseInt(vm.onkoEventEditorModel._id);
                    vm.onkoRejectionEditorModel._id = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].b_prot.length;
                    vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].b_prot.push(vm.onkoRejectionEditorModel);
                    this.new();
                }
            },

            toEditor: function(_id) {
                if (vm.onkoEventEditorModel._id != undefined) {
                    const index = parseInt(vm.onkoEventEditorModel._id);
                    const model = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].b_prot.filter((model) => {
                        return model._id == _id;
                    }).pop();

                    vm.onkoRejectionEditorModel = model;
                    $('a[href~="#onkoRejectionEditor_Tab_Editor"]').tab('show');
                }
            }
        }


        // ------------------------------- onkoDiagEditor
        vm.onkoDiagEditorModel = angular.copy(Object.assign({}, {
            "diag_date": null,
            "diag_tip": null,
            "diag_code": null,
            "diag_rslt": null,
            "rec_rslt": null
        }));

        vm.onkoDiagEditor = {
            new: function() {
                vm.onkoDiagEditorModel = angular.copy(Object.assign({}, {
                    "diag_date": null,
                    "diag_tip": null,
                    "diag_code": null,
                    "diag_rslt": null,
                    "rec_rslt": null
                }));
            },

            pop: function() {
                if (vm.onkoEventEditorModel._id != undefined) {
                    const index = parseInt(vm.onkoEventEditorModel._id);
                    const models = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].b_diag.filter((model) => {
                        return model._id != vm.onkoDiagEditorModel._id;
                    });

                    vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].b_diag = models;
                    this.new();
                }
            },

            push: function() {
                

                if (vm.onkoEventEditorModel._id != undefined) {
                    if (vm.onkoDiagEditorModel._id == undefined) {
                        const index = parseInt(vm.onkoEventEditorModel._id);
                        const randomId = Math.random().toString().split('.')[1];
                        vm.onkoDiagEditorModel._id = randomId;
                        vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].b_diag.push(vm.onkoDiagEditorModel);
                        this.new();
                    }
                }

            },

            toEditor: function(_id) {
                if (vm.onkoEventEditorModel._id != undefined) {
                    const index = parseInt(vm.onkoEventEditorModel._id);
                    const model = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].b_diag.filter((model) => {
                        return model._id == _id;
                    }).pop();

                    vm.onkoDiagEditorModel = model;
                    $('a[href~="#onkoDiagEditor_Tab_Editor"]').tab('show');
                }
            }
        }


        // ------------------------------- onkoServiceEditor
        vm.onkoServiceEditorModel = angular.copy(Object.assign({}, {
            "usl_tip": "0",
            "hir_tip": null,
            "lek_tip_l": null,
            "lek_tip_v": null,
            "lek_pr": [],
            "pptr": null,
            "luch_tip": null
        }));

        vm.onkoServiceEditor = {
            new: function() {
                vm.onkoServiceEditorModel = angular.copy(Object.assign({}, {
                    "usl_tip": "0",
                    "hir_tip": null,
                    "lek_tip_l": null,
                    "lek_tip_v": null,
                    "lek_pr": [],
                    "pptr": null,
                    "luch_tip": null
                }));
            },

            pop: function() {
                if (vm.onkoEventEditorModel._id != undefined) {
                    const index = parseInt(vm.onkoEventEditorModel._id);
                    const models = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].onk_usl.filter((model) => {
                        return model._id != vm.onkoServiceEditorModel._id;
                    });

                    vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].onk_usl = models;
                    this.new();
                }
            },

            push: function() {
                if (vm.onkoEventEditorModel._id != undefined) {
                    const index = parseInt(vm.onkoEventEditorModel._id);
                    vm.onkoServiceEditorModel._id = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].onk_usl.length;
                    vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].onk_usl.push(vm.onkoServiceEditorModel);
                    this.new();
                }
            },

            toEditor: function(_id) {
                if (vm.onkoEventEditorModel._id != undefined) {
                    const index = parseInt(vm.onkoEventEditorModel._id);
                    const model = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].onk_usl.filter((model) => {
                        return model._id == _id;
                    }).pop();

                    vm.onkoServiceEditorModel = model;
                    $('a[href~="#onkoServiceEditor_Tab_Editor"]').tab('show');
                }
            }
        }



        // ------------------------------- onkoDragEditor
        vm.onkoDragEditorModel = angular.copy(Object.assign({}, {
            "regnum": "0",
            "date_inj": "1967-08-13"
        }));
        vm.onkoDragEditor = {
            new: function() {
                vm.onkoDragEditorModel = angular.copy(Object.assign({}, {
                    "regnum": "0",
                    "date_inj": "1967-08-13"
                }));
            },

            pop: function() {
                if (vm.onkoEventEditorModel._id != undefined) {
                    const index = parseInt(vm.onkoEventEditorModel._id);

                    if (vm.onkoServiceEditorModel._id != undefined) {
                        const subIndex = parseInt(vm.onkoServiceEditorModel._id);

                        const models = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].onk_usl[subIndex].lek_pr.filter((model) => {
                            return model._id != vm.onkoDragEditorModel._id;
                        });

                        vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].onk_usl[subIndex].lek_pr = models;
                        this.new();
                    }
                }
            },

            push: function() {
                if (vm.onkoEventEditorModel._id != undefined) {
                    const index = parseInt(vm.onkoEventEditorModel._id);

                    if (vm.onkoServiceEditorModel._id != undefined) {
                        const subIndex = parseInt(vm.onkoServiceEditorModel._id);
                        const length = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].onk_usl[subIndex].lek_pr.length;
                        vm.onkoDragEditorModel._id = length;
                        vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].onk_usl[subIndex].lek_pr.push(vm.onkoDragEditorModel);
                        this.new();
                        //this.toEditor(length);
                    }
                }
            },

            toEditor: function(_id) {
                if (vm.onkoEventEditorModel._id != undefined) {
                    const index = parseInt(vm.onkoEventEditorModel._id);

                    if (vm.onkoServiceEditorModel._id != undefined) {
                        const subIndex = parseInt(vm.onkoServiceEditorModel._id);

                        const model = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].onk_sl[index].onk_usl[subIndex].lek_pr.filter((model) => {
                            return model._id == _id;
                        }).pop();

                        vm.onkoDragEditorModel = model;
                        $('a[href~="#onkoDragEditor_Tab_Editor"]').tab('show');

                    }


                }
            }
        }



        vm.uslEditorModel = JSON.parse(angular.toJson(
            Object.assign({}, {
                "idserv": "0",
                "lpu": "0",
                "lpu_1": null,
                "podr": null,
                "profil": "0",
                "vid_vme": null,
                "det": "0",
                "date_in": "1967-08-13",
                "date_out": "1967-08-13",
                "ds": "0",
                "code_usl": "0",
                "kol_usl": "1.00",
                "tarif": null,
                "sumv_usl": "0.00",
                "prvs": "0",
                "code_md": "0",
                "npl": null,
                "comentu": null
            })
        ));

        vm.uslEditor = {
            new: function() {
                vm.uslEditorModel = JSON.parse(angular.toJson(
                    Object.assign({}, {
                        "idserv": "0",
                        "lpu": "0",
                        "lpu_1": null,
                        "podr": null,
                        "profil": "0",
                        "vid_vme": null,
                        "det": "0",
                        "date_in": "1967-08-13",
                        "date_out": "1967-08-13",
                        "ds": "0",
                        "code_usl": "0",
                        "kol_usl": "0.00",
                        "tarif": null,
                        "sumv_usl": "0.00",
                        "prvs": "0",
                        "code_md": "0",
                        "npl": null,
                        "comentu": null
                    })
                ));
            },

            pop: function() {
                const models = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].usl.filter((model) => {
                    return model._id != vm.uslEditorModel._id;
                });

                vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].usl = models;
                this.new();
            },

            push: function() {
                if (vm.uslEditorModel._id == undefined) {
                    const lenght = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].usl.length;
                    vm.uslEditorModel._id = lenght;
                    console.log(vm.slIndex, vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].usl, JSON.parse(angular.toJson(Object.assign({}, vm.uslEditorModel))));
                    vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].usl.push(
                        JSON.parse(angular.toJson(Object.assign({}, vm.uslEditorModel)))
                    );
                    this.new();
                    //this.toEditor(length);
                }


            },

            toEditor: function(_id) {
                const model = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].usl.filter((model) => {
                    return model._id == _id;
                }).pop();

                vm.uslEditorModel = model;
                $('a[href~="#uslEditor_Tab_Editor"]').tab('show');
            }

        }

        vm.ksgEditorModel = JSON.parse(angular.toJson(
            Object.assign({}, {
                "n_ksg": null,
                "ver_ksg": "2020",
                "ksg_pg": "0",
                "n_kpg": null,
                "koef_z": "00.000",
                "koef_up": "00.000",
                "bztsz": "00.00",
                "koef_d": "00.000",
                "koef_u": "00.000",
                "crit": [],
                "sl_k": "0",
                "it_sl": null,
                "sl_koef": []
            })));

        vm.ksgEditor = {
            new: function() {
                vm.ksgEditorModel = JSON.parse(angular.toJson(
                    Object.assign({}, {
                        "n_ksg": null,
                        "ver_ksg": "2020",
                        "ksg_pg": "0",
                        "n_kpg": null,
                        "koef_z": "00.000",
                        "koef_up": "00.000",
                        "bztsz": "00.00",
                        "koef_d": "00.000",
                        "koef_u": "00.000",
                        "crit": [],
                        "sl_k": "0",
                        "it_sl": null,
                        "sl_koef": []
                    })));
            },

            pop: function() {
                vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg = null;
            },

            push: function() {
                vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg = vm.ksgEditorModel;
                //this.new();
            }

        }


        vm.slkoefEditorModel = JSON.parse(angular.toJson(
            Object.assign({}, {
                "idsl": "0",
                "z_sl": "0.00000"
            })));

        vm.slkoefEditor = {
            new: function() {
                vm.slkoefEditorModel = JSON.parse(angular.toJson(
                    Object.assign({}, {
                        "idsl": "0",
                        "z_sl": "0.00000"
                    })));
            },

            pop: function() {
                vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.sl_koef = null;
                this.new();
            },

            push: function() {
                if (vm.slkoefEditorModel._id == undefined) {
                    const sl_koef = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.sl_koef;

                    if (sl_koef) {
                        const length = sl_koef.length;
                    } else {
                        const length = 0;
                        vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.sl_koef = [];
                    }
                    
                    vm.slkoefEditorModel._id = length;
                    vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.sl_koef.push(vm.slkoefEditorModel);
                    this.new();
                }

            },

            toEditor: function(_id) {

                const model = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.sl_koef.filter((model) => {
                    return model._id == _id;
                }).pop();

                vm.slkoefEditorModel = model;
                $('a[href~="#slkoefEditor_Tab_Editor"]').tab('show');

            }

        }


        vm.critEditor = JSON.parse(angular.toJson(
            Object.assign({}, {
                "crit": "0",
            })));

        vm.critEditor = {
            new: function() {
                vm.critEditorModel = JSON.parse(angular.toJson(
                    Object.assign({}, {
                        "crit": "0",
                    })));
            },

            pop: function() {
                const models = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.crit.filter((model) => {
                    return model._id != vm.critEditorModel._id;
                });
                vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.crit = models;
                this.new();
            },

            push: function() {
                if (vm.critEditorModel._id == undefined) {
                    const length = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.crit.length;
                    vm.critEditorModel._id = length;
                    vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.crit.push(vm.critEditorModel);
                    this.new();
                }

            },

            update: function() {
                if (vm.critEditorModel._id != undefined) {
                    const crits = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.crit.map((crit) => {
                        if (crit._id == vm.critEditorModel._id) {
                            crit.crit = vm.critEditorModel.crit;
                        }
                        return crit;
                    });
                }
            },

            toEditor: function(_id) {
                const model = vm.talonEditorModel.zl_list.zap.z_sl.sl[vm.slIndex].ksg_kpg.crit.filter((model) => {
                    return model._id == _id;
                }).pop();

                vm.critEditorModel = model;
                $('a[href~="#critEditor_Tab_Editor"]').tab('show');
            }

        }







    }

})();