new Vue({
    el: '#app',
    data: {
        appName: 'Compatibilidad entre elementos',
        appDesc: 'Utilidad de configuración',
        rules: [{
            mainText: 'La utilidad permite definir la compatibilidad entre habitaciones',
            secondaryText: 'a la hora de decidir a qué habitación pasar los overbookings.'
        }, {
            mainText: 'La compatibilidad se aplica en un solo sentido​.',
            secondaryText: 'Por ejemplo, si A ya es compatible con B, no se puede hacer a B compatible con A.'
        }, {
            mainText: 'No puede haber conexión circular entre elementos​.',
            secondaryText: 'Por ejemplo, si A es compatible con B, y B es compatible con C, entonces C no puede ser compatible con A. Ni con B. Ni ningún elemento puede ser compatible con él mismo.'
        }],
        elements: [{
            id: 'singleRoom',
            name: 'Single Room',
            fontAwesomeIcons: ['fa-bed'],
            compatibleElementIds: [],
            quantity: 30,
            virtualQuantity: 0
        }, {
            id: 'doubleRoom',
            name: 'Double Room',
            fontAwesomeIcons: ['fa-bed', 'fa-bed'],
            compatibleElementIds: [],
            quantity: 20,
            virtualQuantity: 0
        }, {
            id: 'suite',
            name: 'Suite',
            fontAwesomeIcons: ['fa-star', 'fa-bed'],
            compatibleElementIds: [],
            quantity: 20,
            virtualQuantity: 0
        }]
    },
    created: function() {
        this.elements.forEach(function(elem) {
            elem.virtualQuantity  = elem.quantity;
        });
    },
    methods: {
        isIncompatible: function(elemId, compatibleElemId) {
            var result = false;

            this.elements.forEach(function(elem) {
                if (elem.id === compatibleElemId) {
                    result = elem.compatibleElementIds.includes(elemId);
                }
            });

            return result;
        },
        isCircularConnection: function(elemId, compatibleElemId, result) {
            var _this = this;
            var result = result || false;

            for (var elem of this.elements) {
                if (elem.id === compatibleElemId) {
                    for (var compatElemId of elem.compatibleElementIds) {
                        if (compatElemId === elemId) {
                            // Circular connection detected
                            result = true;
                            break;
                        } else {
                            result = _this.isCircularConnection(
                                elemId, compatElemId, result
                            );
                        }
                    }
                }
            }

            return result;
        },
        calcVirtualTotal: function(elemId, compatibleElemId, event) {
            var _this = this;

            this.elements.forEach(function(elem) {
                if (elem.id === compatibleElemId) {
                    if (event.target.checked === true) {
                        elem.virtualQuantity =
                            elem.virtualQuantity +
                            _this.getElementQuantity(elemId);
                    } else {
                        elem.virtualQuantity =
                            elem.virtualQuantity -
                            _this.getElementQuantity(elemId);
                    }
                }
            });
        },
        getElementQuantity: function(elemId) {
            var quantity = 0;

            this.elements.forEach(function(elem) {
                if (elem.id === elemId) {
                    quantity = elem.quantity;
                }
            });

            return quantity;
        }
    }
})