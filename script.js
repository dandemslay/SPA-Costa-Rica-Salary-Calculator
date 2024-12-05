// Constantes para cálculos
const HOURS_PER_DAY = 8;
const DAYS_PER_WEEK = 5;
const WEEKS_PER_MONTH = 4.33;
const MONTHS_PER_YEAR = 12;

// Elementos del DOM
const amountInput = document.getElementById('amount');
const timeUnitSelect = document.getElementById('timeUnit');
const projectHoursInput = document.getElementById('projectHours');
const hoursPerDayInput = document.getElementById('hoursPerDay');
const daysPerWeekInput = document.getElementById('daysPerWeek');

// Elementos para cálculo de costo de proyecto
const monthlyRateInput = document.getElementById('monthlyRate');
const projectMonthsInput = document.getElementById('projectMonths');
const ivaRateInput = document.getElementById('ivaRate');

// Elementos para calculadora CR
const salarioOrdinarioInput = document.getElementById('salarioOrdinario');
const comisionesInput = document.getElementById('comisiones');
const bonificacionesRecurrentesInput = document.getElementById('bonificacionesRecurrentes');
const horasExtrasInput = document.getElementById('horasExtras');
const vacacionesInput = document.getElementById('vacaciones');
const bonificacionesOcasionalesInput = document.getElementById('bonificacionesOcasionales');
const participacionUtilidadesInput = document.getElementById('participacionUtilidades');
const combustibleInput = document.getElementById('combustible');
const telefonoInput = document.getElementById('telefono');
const transporteInput = document.getElementById('transporte');
const otrosReembolsosInput = document.getElementById('otrosReembolsos');
const asociacionSoldaristaInput = document.getElementById('asociacionSolidarista');
const pensionVoluntariaInput = document.getElementById('pensionVoluntaria');

// Elementos para tabs
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');

// Event listeners para tabs
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        
        // Remover clase activa de todos los botones y panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));
        
        // Agregar clase activa al botón clickeado
        button.classList.add('active');
        
        // Mostrar el panel correspondiente
        document.getElementById(tabId).classList.add('active');
    });
});

// Constantes para deducciones CR
const CCSS_EM_RATE = 0.055;  // 5.5%
const CCSS_IVM_RATE = 0.0267; // 2.67%
const BANCO_POPULAR_RATE = 0.01; // 1%

// Función para calcular salarios
function calculateSalary() {
    const amount = parseFloat(amountInput.value) || 0;
    const timeUnit = timeUnitSelect.value;
    let hourlyRate;

    // Calcular tarifa por hora basada en la unidad de tiempo seleccionada
    switch(timeUnit) {
        case 'hour':
            hourlyRate = amount;
            break;
        case 'day':
            hourlyRate = amount / HOURS_PER_DAY;
            break;
        case 'week':
            hourlyRate = amount / (HOURS_PER_DAY * DAYS_PER_WEEK);
            break;
        case 'month':
            hourlyRate = amount / (HOURS_PER_DAY * DAYS_PER_WEEK * WEEKS_PER_MONTH);
            break;
        case 'year':
            hourlyRate = amount / (HOURS_PER_DAY * DAYS_PER_WEEK * WEEKS_PER_MONTH * MONTHS_PER_YEAR);
            break;
    }

    // Actualizar resultados
    document.getElementById('hourly').textContent = formatCurrency(hourlyRate);
    document.getElementById('daily').textContent = formatCurrency(hourlyRate * HOURS_PER_DAY);
    document.getElementById('weekly').textContent = formatCurrency(hourlyRate * HOURS_PER_DAY * DAYS_PER_WEEK);
    document.getElementById('monthly').textContent = formatCurrency(hourlyRate * HOURS_PER_DAY * DAYS_PER_WEEK * WEEKS_PER_MONTH);
    document.getElementById('yearly').textContent = formatCurrency(hourlyRate * HOURS_PER_DAY * DAYS_PER_WEEK * WEEKS_PER_MONTH * MONTHS_PER_YEAR);
}

// Función para calcular tiempo de proyecto
function calculateProjectTime() {
    const totalHours = parseFloat(projectHoursInput.value) || 0;
    const hoursPerDay = parseFloat(hoursPerDayInput.value) || HOURS_PER_DAY;
    const daysPerWeek = parseFloat(daysPerWeekInput.value) || DAYS_PER_WEEK;

    const days = totalHours / hoursPerDay;
    const weeks = days / daysPerWeek;
    const months = weeks / WEEKS_PER_MONTH;

    document.getElementById('projectDays').textContent = formatNumber(days);
    document.getElementById('projectWeeks').textContent = formatNumber(weeks);
    document.getElementById('projectMonths').textContent = formatNumber(months);
}

// Función para calcular costos del proyecto
function calculateProjectCosts() {
    const monthlyRate = parseFloat(monthlyRateInput.value) || 0;
    const months = parseFloat(projectMonthsInput.value) || 1;
    const ivaRate = parseFloat(ivaRateInput.value) || 0;

    const baseCost = monthlyRate * months;
    const ivaCost = (baseCost * ivaRate) / 100;
    const totalCost = baseCost + ivaCost;

    document.getElementById('baseCost').textContent = formatCurrency(baseCost);
    document.getElementById('ivaCost').textContent = formatCurrency(ivaCost);
    document.getElementById('totalCost').textContent = formatCurrency(totalCost);
}

// Función para calcular salario CR
function calculateCRSalary() {
    // Calcular salario bruto
    const salarioBruto = calcularSalarioBruto();
    
    // Calcular deducciones
    const ccssEm = salarioBruto * CCSS_EM_RATE;
    const ccssIvm = salarioBruto * CCSS_IVM_RATE;
    const bancoPop = salarioBruto * BANCO_POPULAR_RATE;
    const asoc = salarioBruto * (parseFloat(asociacionSoldaristaInput.value) / 100 || 0);
    const pension = salarioBruto * (parseFloat(pensionVoluntariaInput.value) / 100 || 0);
    const renta = calcularImpuestoRenta(salarioBruto);
    
    const totalDeducciones = ccssEm + ccssIvm + bancoPop + asoc + pension + renta;
    const salarioNeto = salarioBruto - totalDeducciones;

    // Actualizar resultados
    document.getElementById('salarioBruto').textContent = formatCurrencyCRC(salarioBruto);
    document.getElementById('totalDeducciones').textContent = formatCurrencyCRC(totalDeducciones);
    document.getElementById('salarioNeto').textContent = formatCurrencyCRC(salarioNeto);
    
    // Desglose de deducciones
    document.getElementById('ccssEm').textContent = formatCurrencyCRC(ccssEm);
    document.getElementById('ccssIvm').textContent = formatCurrencyCRC(ccssIvm);
    document.getElementById('bancoPop').textContent = formatCurrencyCRC(bancoPop);
    document.getElementById('asoc').textContent = formatCurrencyCRC(asoc);
    document.getElementById('pension').textContent = formatCurrencyCRC(pension);
    document.getElementById('renta').textContent = formatCurrencyCRC(renta);
}

// Función para calcular impuesto sobre la renta 2023
function calcularImpuestoRenta(baseImponibleMensual) {
    const baseImponibleAnual = baseImponibleMensual * 12;
    let impuestoAnual = 0;

    if (baseImponibleAnual <= 863000 * 12) {
        impuestoAnual = 0;
    } else if (baseImponibleAnual <= 1267000 * 12) {
        impuestoAnual = (baseImponibleAnual - (863000 * 12)) * 0.10;
    } else if (baseImponibleAnual <= 2223000 * 12) {
        impuestoAnual = ((baseImponibleAnual - (1267000 * 12)) * 0.15) + 
                       ((1267000 - 863000) * 12 * 0.10);
    } else if (baseImponibleAnual <= 4445000 * 12) {
        impuestoAnual = ((baseImponibleAnual - (2223000 * 12)) * 0.20) +
                       ((2223000 - 1267000) * 12 * 0.15) +
                       ((1267000 - 863000) * 12 * 0.10);
    } else {
        impuestoAnual = ((baseImponibleAnual - (4445000 * 12)) * 0.25) +
                       ((4445000 - 2223000) * 12 * 0.20) +
                       ((2223000 - 1267000) * 12 * 0.15) +
                       ((1267000 - 863000) * 12 * 0.10);
    }

    return impuestoAnual / 12; // Retorno mensual
}

// Función para calcular salario bruto
function calcularSalarioBruto() {
    // 1. Ingresos Salariales
    const salarioOrdinario = parseFloat(salarioOrdinarioInput.value) || 0;
    const comisiones = parseFloat(comisionesInput.value) || 0;
    const bonificacionesRecurrentes = parseFloat(bonificacionesRecurrentesInput.value) || 0;
    const horasExtras = parseFloat(horasExtrasInput.value) || 0;
    const vacaciones = parseFloat(vacacionesInput.value) || 0;

    // 2. Otros Ingresos Salariales
    const bonificacionesOcasionales = parseFloat(bonificacionesOcasionalesInput.value) || 0;
    const participacionUtilidades = parseFloat(participacionUtilidadesInput.value) || 0;

    // 3. Reembolsos
    const combustible = parseFloat(combustibleInput.value) || 0;
    const telefono = parseFloat(telefonoInput.value) || 0;
    const transporte = parseFloat(transporteInput.value) || 0;
    const otrosReembolsos = parseFloat(otrosReembolsosInput.value) || 0;

    // 4. Deducciones Personalizables
    const asociacionSolidarista = parseFloat(asociacionSoldaristaInput.value) || 0;
    const pensionVoluntaria = parseFloat(pensionVoluntariaInput.value) || 0;

    // Cálculos de totales
    const totalIngresosSalariales = salarioOrdinario + comisiones + bonificacionesRecurrentes + 
                                  horasExtras + vacaciones;
    const totalOtrosIngresos = bonificacionesOcasionales + participacionUtilidades;
    const totalReembolsos = combustible + telefono + transporte + otrosReembolsos;
    
    // Base para deducciones
    const baseParaDeducciones = totalIngresosSalariales + totalOtrosIngresos;
    
    return baseParaDeducciones;
}

// Manejo de temas
const themeSelect = document.getElementById('themeSelect');

// Función para establecer el tema
function setTheme(theme) {
    if (theme === 'system') {
        // Eliminar el atributo data-theme para usar el tema del sistema
        document.documentElement.removeAttribute('data-theme');
        
        // Detectar preferencia del sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Guardar preferencia
    localStorage.setItem('theme', theme);
}

// Cargar tema guardado o usar el del sistema
const savedTheme = localStorage.getItem('theme') || 'system';
themeSelect.value = savedTheme;
setTheme(savedTheme);

// Escuchar cambios en el selector de tema
themeSelect.addEventListener('change', (e) => {
    setTheme(e.target.value);
});

// Escuchar cambios en la preferencia del sistema
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (themeSelect.value === 'system') {
            setTheme('system');
        }
    });
}

// Modal de guía
const modal = document.getElementById('guideModal');
const showGuideBtn = document.getElementById('showGuide');
const closeBtn = document.querySelector('.close-button');

if (showGuideBtn) {
    showGuideBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });
}

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Función para formatear números
function formatNumber(number) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }).format(number);
}

// Función para formatear moneda USD
function formatCurrency(amount) {
    const formatted = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }).format(amount);
    return formatted + ' US$';
}

// Función para formatear moneda CRC
function formatCurrencyCRC(amount) {
    const formatted = new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }).format(amount);
    return '₡' + formatted;
}

// Event listeners para cálculos
amountInput.addEventListener('input', calculateSalary);
timeUnitSelect.addEventListener('change', calculateSalary);

projectHoursInput.addEventListener('input', calculateProjectTime);
hoursPerDayInput.addEventListener('input', calculateProjectTime);
daysPerWeekInput.addEventListener('input', calculateProjectTime);

projectMonthsInput.addEventListener('input', calculateProjectCosts);
monthlyRateInput.addEventListener('input', calculateProjectCosts);
ivaRateInput.addEventListener('input', calculateProjectCosts);

// Event listeners para calculadora CR
const crInputs = [
    salarioOrdinarioInput, comisionesInput, bonificacionesRecurrentesInput,
    horasExtrasInput, vacacionesInput, bonificacionesOcasionalesInput,
    participacionUtilidadesInput, combustibleInput, telefonoInput,
    transporteInput, otrosReembolsosInput, asociacionSoldaristaInput,
    pensionVoluntariaInput
];

crInputs.forEach(input => {
    if (input) { // Verificar que el input existe
        input.addEventListener('input', calculateCRSalary);
    }
});

// Calcular inicialmente
calculateSalary();
calculateProjectTime();
calculateProjectCosts();
calculateCRSalary();

// Activar el primer tab por defecto
if (tabButtons.length > 0) {
    tabButtons[0].click();
}
