// Constantes para cálculos
const HOURS_PER_DAY = 8;
const DAYS_PER_WEEK = 5;
const WEEKS_PER_MONTH = 4;
const MONTHS_PER_YEAR = 12;

// Elementos del DOM
const amountInput = document.getElementById('amount');
const timeUnitSelect = document.getElementById('timeUnit');
const projectHoursInput = document.getElementById('projectHours');
const hoursPerDayInput = document.getElementById('hoursPerDay');

// Elementos para cálculo de costo de proyecto
const monthlyRateInput = document.getElementById('monthlyRate');
const hoursPerMonthInput = document.getElementById('hoursPerMonth');
const projectMonthsInput = document.getElementById('projectDuration');
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

    const days = totalHours / hoursPerDay;
    const weeks = days / DAYS_PER_WEEK;
    const months = weeks / WEEKS_PER_MONTH;

    document.getElementById('projectDays').textContent = formatNumber(days);
    document.getElementById('projectWeeks').textContent = formatNumber(weeks);
    document.getElementById('projectMonths').textContent = formatNumber(months);
}

// Función para calcular costos del proyecto
function calculateProjectCosts() {
    // Obtener valores de los inputs
    const hourlyRate = parseFloat(monthlyRateInput.value) || 0;
    const hoursPerMonth = parseFloat(hoursPerMonthInput.value) || 0;
    const projectMonths = parseFloat(projectMonthsInput.value) || 1; // Mínimo 1 mes
    const ivaRate = parseFloat(ivaRateInput.value) || 0;

    // Cálculos mensuales
    const monthCostNoIva = hourlyRate * hoursPerMonth;
    const monthIva = (monthCostNoIva * ivaRate) / 100;
    const monthCostWithIva = monthCostNoIva + monthIva;

    // Cálculos totales para todo el proyecto
    const totalCostNoIva = monthCostNoIva * projectMonths;
    const totalIva = monthIva * projectMonths;
    const totalCostWithIva = monthCostWithIva * projectMonths;

    // Actualizar resultados mensuales
    document.getElementById('monthCostNoIva').textContent = formatCurrency(monthCostNoIva);
    document.getElementById('monthIva').textContent = formatCurrency(monthIva);
    document.getElementById('monthCostWithIva').textContent = formatCurrency(monthCostWithIva);

    // Actualizar resultados totales del proyecto
    document.getElementById('totalCostNoIva').textContent = formatCurrency(totalCostNoIva);
    document.getElementById('totalIva').textContent = formatCurrency(totalIva);
    document.getElementById('totalCostWithIva').textContent = formatCurrency(totalCostWithIva);

    // Debug - mostrar en consola para verificar
    console.log('Cálculos del proyecto:', {
        hourlyRate,
        hoursPerMonth,
        projectMonths,
        ivaRate,
        monthCostNoIva,
        monthIva,
        monthCostWithIva,
        totalCostNoIva,
        totalIva,
        totalCostWithIva
    });
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

// Función para calcular salario CR
function calculateCRSalary() {
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
    
    // Calcular deducciones
    const ccssEM = baseParaDeducciones * CCSS_EM_RATE;
    const ccssIVM = baseParaDeducciones * CCSS_IVM_RATE;
    const bancoPop = baseParaDeducciones * BANCO_POPULAR_RATE;
    const montoSolidarista = baseParaDeducciones * (asociacionSolidarista / 100);
    
    // Pensión voluntaria (máximo 10% para exención de impuestos)
    const pensionVoluntariaMax = baseParaDeducciones * 0.10;
    const montoPensionVoluntaria = Math.min(
        baseParaDeducciones * (pensionVoluntaria / 100),
        pensionVoluntariaMax
    );

    // Base imponible para impuesto de renta
    const baseImponible = baseParaDeducciones - montoPensionVoluntaria;
    const impuestoRenta = calcularImpuestoRenta(baseImponible);

    // Total deducciones
    const totalDeducciones = ccssEM + ccssIVM + bancoPop + montoSolidarista + 
                           montoPensionVoluntaria + impuestoRenta;

    // Salario neto
    const salarioNeto = baseParaDeducciones + totalReembolsos - totalDeducciones;

    // Actualizar resultados
    document.getElementById('totalIngresosSalariales').textContent = formatCurrencyCRC(totalIngresosSalariales);
    document.getElementById('totalOtrosIngresos').textContent = formatCurrencyCRC(totalOtrosIngresos);
    document.getElementById('totalReembolsos').textContent = formatCurrencyCRC(totalReembolsos);
    
    document.getElementById('ccssEM').textContent = formatCurrencyCRC(ccssEM);
    document.getElementById('ccssIVM').textContent = formatCurrencyCRC(ccssIVM);
    document.getElementById('bancoPop').textContent = formatCurrencyCRC(bancoPop);
    document.getElementById('montoSolidarista').textContent = formatCurrencyCRC(montoSolidarista);
    document.getElementById('montoPensionVoluntaria').textContent = formatCurrencyCRC(montoPensionVoluntaria);
    
    document.getElementById('salarioBrutoTotal').textContent = formatCurrencyCRC(baseParaDeducciones);
    document.getElementById('baseImponible').textContent = formatCurrencyCRC(baseImponible);
    document.getElementById('impuestoRenta').textContent = formatCurrencyCRC(impuestoRenta);
    
    document.getElementById('totalDeducciones').textContent = formatCurrencyCRC(totalDeducciones);
    document.getElementById('salarioNeto').textContent = formatCurrencyCRC(salarioNeto);
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

// Función para formatear moneda
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

// Función para formatear números
function formatNumber(number) {
    return new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }).format(number);
}

// Función para formatear moneda en colones
function formatCurrencyCRC(amount) {
    return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: 'CRC',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

// Manejo de tabs
const tabButtons = document.querySelectorAll('.tab-button');
const tabPanes = document.querySelectorAll('.tab-pane');

function switchTab(tabId) {
    // Desactivar todos los tabs
    tabButtons.forEach(button => button.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    // Activar el tab seleccionado
    const selectedButton = document.querySelector(`[data-tab="${tabId}"]`);
    const selectedPane = document.getElementById(tabId);
    
    selectedButton.classList.add('active');
    selectedPane.classList.add('active');
}

// Event listeners para tabs
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab');
        switchTab(tabId);
    });
});

// Modal de guía
const modal = document.getElementById('guideModal');
const showGuideBtn = document.getElementById('showGuide');
const closeBtn = document.querySelector('.close-button');

showGuideBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Event listeners
amountInput.addEventListener('input', calculateSalary);
timeUnitSelect.addEventListener('change', calculateSalary);
projectHoursInput.addEventListener('input', calculateProjectTime);
hoursPerDayInput.addEventListener('input', calculateProjectTime);
monthlyRateInput.addEventListener('input', calculateProjectCosts);
hoursPerMonthInput.addEventListener('input', calculateProjectCosts);
projectMonthsInput.addEventListener('input', calculateProjectCosts);
ivaRateInput.addEventListener('input', calculateProjectCosts);

const crInputs = [
    salarioOrdinarioInput, comisionesInput, bonificacionesRecurrentesInput,
    horasExtrasInput, vacacionesInput, bonificacionesOcasionalesInput,
    participacionUtilidadesInput, combustibleInput, telefonoInput,
    transporteInput, otrosReembolsosInput, asociacionSoldaristaInput,
    pensionVoluntariaInput
];

crInputs.forEach(input => {
    input.addEventListener('input', calculateCRSalary);
});

// Calcular inicialmente
calculateSalary();
calculateProjectTime();
calculateProjectCosts();
calculateCRSalary();
