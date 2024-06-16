// Inicializar el mapa con límites de desplazamiento y arrastre infinito desactivado
var map = L.map('map', {
    zoomControl: false,
    attributionControl: false,
    worldCopyJump: false
}).setView([20, 0], 2.5);

document.getElementById('zoom-in').onclick = function() {
    map.zoomIn();
};

document.getElementById('zoom-out').onclick = function() {
    map.zoomOut();
};

var southWest = L.latLng(-85, -180),
    northEast = L.latLng(85, 180);
var bounds = L.latLngBounds(southWest, northEast);
map.setMaxBounds(bounds);

map.doubleClickZoom.disable();

map.on('drag', function() {
    map.panInsideBounds(bounds, { animate: false });
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=YOUR_ACCESS_TOKEN', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://www.mapbox.com/about/maps/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

var geojson;
var countryInfo = {};

// Estilo para los países
function style(feature) {
    return {
        fillColor: '#80cbc4',
        weight: 2,
        opacity: 1,
        color: '#00796b',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// URL de la API local que proporciona los datos JSON
const apiURL = 'countryInfo.json';

// Cargar los datos de información de los países desde la API local
fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        countryInfo = data;
    })
    .catch(error => console.error('Error al cargar los datos de información de los países:', error));

// Cargar los datos GeoJSON de los países
fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
    .then(response => response.json())
    .then(data => {
        geojson = L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    })
    .catch(error => console.error('Error al cargar los datos GeoJSON:', error));

// Listas de países por organización
var euCountries = ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic","Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary","Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands","Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"];
var natoCountries = ["Albania", "Belgium", "Bulgaria", "Canada", "Croatia", "Czech Republic", "Denmark", "Estonia", "France", "Germany", "Greece", "Hungary", "Iceland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Montenegro", "Netherlands", "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Turkey", "United Kingdom", "United States of America", "Finland", "Sweden"];
var unCountries = ["Afghanistan", "The Bahamas", "Puerto Rico", "Guinea Bissau", "United Republic of Tanzania", "Taiwan", "New Caledonia", "Republic of Serbia", "Greenland",  "Kosovo", "Macedonia", "Ivory Coast", "Republic of Congo", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];

// Manejo de pestañas desplegables
document.querySelectorAll('.accordion-button').forEach(button => {
    button.addEventListener('click', function () {
        this.classList.toggle('active');
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
});

// Función para obtener color basado en organizaciones internacionales
function getOrganizationColor(organization) {
    switch (organization) {
        case 'EU':
            return '#003399';
        case 'NATO':
            return '#0033A0';
        case 'UN':
            return '#009EDB';
        default:
            return '#80cbc4';
    }
}

// Evento para la casilla de verificación de la Unión Europea
document.getElementById('eu-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            if (euCountries.includes(countryName)) {
                layer.setStyle({
                    fillColor: getOrganizationColor('EU'),
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getOrganizationColor('EU');
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});

// Evento para la casilla de verificación de la OTAN
document.getElementById('nato-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            if (natoCountries.includes(countryName)) {
                layer.setStyle({
                    fillColor: getOrganizationColor('NATO'),
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getOrganizationColor('NATO');
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});

// Evento para la casilla de verificación de la ONU
document.getElementById('un-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            if (unCountries.includes(countryName)) {
                layer.setStyle({
                    fillColor: getOrganizationColor('UN'),
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getOrganizationColor('UN');
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});

// Diccionario con los datos adicionales
var hdiData = {};
var densityData = {};
var gdpData = {};
var exportsData = {};
var importsData = {};
var unemploymentData = {};
var governmentTypeData = {};
var democracyIndexData = {};

// Cargar los datos de información de los países desde la API local y actualizar los diccionarios
fetch(apiURL)
    .then(response => response.json())
    .then(data => {
        countryInfo = data;

        // Extraer datos de IDH, densidad de población, PIB, etc.
        for (let country in data) {
            if (data[country].hdi !== undefined) hdiData[country] = data[country].hdi;
            if (data[country].density !== undefined) densityData[country] = data[country].density;
            if (data[country].gdp !== undefined) gdpData[country] = data[country].gdp;
            if (data[country].exports !== undefined) exportsData[country] = data[country].exports;
            if (data[country].imports !== undefined) importsData[country] = data[country].imports;
            if (data[country].unemployment !== undefined) unemploymentData[country] = data[country].unemployment;
            if (data[country].governmentType !== undefined) governmentTypeData[country] = data[country].governmentType;
            if (data[country].democracyIndex !== undefined) democracyIndexData[country] = data[country].democracyIndex;
        }
    })
    .catch(error => console.error('Error al cargar los datos de información de los países:', error));

// Función para obtener un color basado en el IDH
function getHdiColor(hdi) {
    if (hdi >= 0.9) return '#004529';
    if (hdi >= 0.85) return '#238443';
    if (hdi >= 0.8) return '#78C679';
    if (hdi >= 0.75) return '#C2E699';
    if (hdi >= 0.7) return '#FFFFB2';
    if (hdi >= 0.65) return '#FED976';
    if (hdi >= 0.6) return '#FEB24C';
    if (hdi >= 0.55) return '#FD8D3C';
    if (hdi >= 0.5) return '#F03B20';
    return '#BD0026';
}

// Evento para la casilla de verificación del IDH
document.getElementById('hdi-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            var hdi = hdiData[countryName];
            if (hdi !== undefined) {
                layer.setStyle({
                    fillColor: getHdiColor(hdi),
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getHdiColor(hdi);
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});

// Función para obtener un color basado en la densidad de población
function getDensityColor(density) {
    if (density >= 1000) return '#800026';
    if (density >= 500) return '#BD0026';
    if (density >= 250) return '#E31A1C';
    if (density >= 100) return '#FC4E2A';
    if (density >= 50) return '#FD8D3C';
    if (density >= 25) return '#FEB24C';
    if (density >= 10) return '#FED976';
    return '#FFEDA0';
}

// Evento para la casilla de verificación de la densidad de población
document.getElementById('density-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            var density = densityData[countryName];
            if (density !== undefined) {
                layer.setStyle({
                    fillColor: getDensityColor(density),
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getDensityColor(density);
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});

// Evento para la casilla de verificación del PIB
document.getElementById('gdp-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            var gdp = gdpData[countryName];
            if (gdp !== undefined) {
                layer.setStyle({
                    fillColor: getHdiColor(gdp), // Utiliza una función similar a getHdiColor para el PIB
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getHdiColor(gdp); // Ajustar según el color deseado
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});

// Evento para la casilla de verificación de exportaciones en función del PIB
document.getElementById('exports-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            var exports = exportsData[countryName];
            if (exports !== undefined) {
                layer.setStyle({
                    fillColor: getHdiColor(exports), // Utiliza una función similar a getHdiColor para exportaciones
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getHdiColor(exports); // Ajustar según el color deseado
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});

// Evento para la casilla de verificación de importaciones en función del PIB
document.getElementById('imports-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            var imports = importsData[countryName];
            if (imports !== undefined) {
                layer.setStyle({
                    fillColor: getHdiColor(imports), // Utiliza una función similar a getHdiColor para importaciones
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getHdiColor(imports); // Ajustar según el color deseado
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});

// Evento para la casilla de verificación de desempleo
document.getElementById('unemployment-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            var unemployment = unemploymentData[countryName];
            if (unemployment !== undefined) {
                layer.setStyle({
                    fillColor: getDensityColor(unemployment), // Utiliza una función similar a getDensityColor para desempleo
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getDensityColor(unemployment); // Ajustar según el color deseado
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});

// Evento para la casilla de verificación del tipo de gobierno
document.getElementById('government-type-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            var governmentType = governmentTypeData[countryName];
            if (governmentType !== undefined) {
                layer.setStyle({
                    fillColor: getOrganizationColor(governmentType), // Ajustar según el color deseado
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getOrganizationColor(governmentType); // Ajustar según el color deseado
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});

// Evento para la casilla de verificación del índice de democracia
document.getElementById('democracy-index-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            var democracyIndex = democracyIndexData[countryName];
            if (democracyIndex !== undefined) {
                layer.setStyle({
                    fillColor: getHdiColor(democracyIndex), // Utiliza una función similar a getHdiColor para índice de democracia
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getHdiColor(democracyIndex); // Ajustar según el color deseado
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});

// Función para resaltar el país al pasar el ratón sin alterar el filtro actual
function highlightOnHover(e) {
    var layer = e.target;

    // Guardar el estilo original si no está ya guardado
    if (!layer.options.originalHighlightStyle) {
        layer.options.originalHighlightStyle = {
            weight: layer.options.weight,
            color: layer.options.color,
            dashArray: layer.options.dashArray,
            fillOpacity: layer.options.fillOpacity
        };
    }

    layer.setStyle({
        weight: 3,
        color: '#004d40',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// Función para restablecer el resaltado al quitar el ratón sin alterar el filtro actual
function resetHighlightOnHover(e) {
    var layer = e.target;

    if (layer.options.originalHighlightStyle) {
        layer.setStyle(layer.options.originalHighlightStyle);
    }
}

// Función para mostrar información al hacer clic en un país y añadir eventos de resaltado
function onEachFeature(feature, layer) {
    layer.on({
        click: function (e) {
            var countryName = feature.properties.ADMIN;
            var info = countryInfo[countryName] || {};

            var infoHTML = `
                <h3>Información General:</h3>
                <p><strong>Capital:</strong> ${info.capital || "N/A"}</p>
                <p><strong>Población:</strong> ${info.population || "N/A"}</p>
                <p><strong>Idiomas oficiales:</strong> ${info.officialLanguages || "N/A"}</p>
                <p><strong>Moneda:</strong> ${info.currency || "N/A"}</p>
            `;

            document.getElementById('country-title').innerText = info.officialName || countryName;
            document.getElementById('country-info').innerHTML = infoHTML;
            document.getElementById('sidebar').classList.remove('hidden'); // Mostrar el sidebar

            var bounds = layer.getBounds();
            map.fitBounds(bounds);
        },
        mouseover: highlightOnHover,
        mouseout: resetHighlightOnHover
    });
}

// Función para resaltar el país buscado
function highlightCountry(layer) {
    layer.setStyle({
        weight: 3,
        color: '#004d40',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function searchCountry() {
    var searchQuery = document.getElementById('country-search').value.toLowerCase();
    var found = false;
    var currentZoomLevel = map.getZoom();
    var currentCenter = map.getCenter();

    resetAllHighlights();

    geojson.eachLayer(function(layer) {
        var countryName = layer.feature.properties.ADMIN.toLowerCase();
        if (countryName === searchQuery) {
            map.fitBounds(layer.getBounds());
            highlightCountry(layer);
            layer.fire('click');
            found = true;
        }
    });

    if (!found) {
        alert('País no encontrado.');
    }
}

document.getElementById('search-button').onclick = searchCountry;

// Función para restablecer el estilo de todos los países
function resetAllHighlights() {
    geojson.eachLayer(function(layer) {
        geojson.resetStyle(layer);
        if (layer.options.originalColor) {
            layer.setStyle({
                fillColor: layer.options.originalColor
            });
        }
    });
    highlightedOrganizations = false;
}
// Función para obtener un color basado en el PIB
function getGdpColor(gdp) {
    if (gdp >= 10000000) return '#00441b';
    if (gdp >= 5000000) return '#006d2c';
    if (gdp >= 1000000) return '#238b45';
    if (gdp >= 500000) return '#41ab5d';
    if (gdp >= 100000) return '#74c476';
    if (gdp >= 50000) return '#a1d99b';
    if (gdp >= 10000) return '#c7e9c0';
    if (gdp >= 5000) return '#e5f5e0';
    return '#f7fcf5';
}

// Función para obtener un color basado en las exportaciones en función del PIB
function getExportsColor(exports) {
    if (exports >= 50) return '#08306b';
    if (exports >= 40) return '#08519c';
    if (exports >= 30) return '#2171b5';
    if (exports >= 20) return '#4292c6';
    if (exports >= 10) return '#6baed6';
    if (exports >= 5) return '#9ecae1';
    if (exports >= 1) return '#c6dbef';
    return '#deebf7';
}

// Función para obtener un color basado en las importaciones en función del PIB
function getImportsColor(imports) {
    if (imports >= 50) return '#67000d';
    if (imports >= 40) return '#a50f15';
    if (imports >= 30) return '#cb181d';
    if (imports >= 20) return '#ef3b2c';
    if (imports >= 10) return '#fb6a4a';
    if (imports >= 5) return '#fc9272';
    if (imports >= 1) return '#fcbba1';
    return '#fee5d9';
}

// Función para obtener un color basado en el tipo de gobierno
function getGovernmentTypeColor(governmentType) {
    switch (governmentType) {
        case 'Democracy':
            return '#2c7bb6';
        case 'Republic':
            return '#d7191c';
        case 'Monarchy':
            return '#fdae61';
        case 'Communism':
            return '#a6d96a';
        default:
            return '#ffffbf';
    }
}

// Función para obtener un color basado en el índice de democracia
function getDemocracyIndexColor(democracyIndex) {
    if (democracyIndex >= 9) return '#1a9850';
    if (democracyIndex >= 8) return '#66bd63';
    if (democracyIndex >= 7) return '#a6d96a';
    if (democracyIndex >= 6) return '#d9ef8b';
    if (democracyIndex >= 5) return '#fee08b';
    if (democracyIndex >= 4) return '#fdae61';
    if (democracyIndex >= 3) return '#f46d43';
    if (democracyIndex >= 2) return '#d73027';
    return '#a50026';
}

// Evento para la casilla de verificación del PIB
document.getElementById('gdp-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            var gdp = gdpData[countryName];
            if (gdp !== undefined) {
                layer.setStyle({
                    fillColor: getGdpColor(gdp),
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getGdpColor(gdp);
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});

// Evento para la casilla de verificación de exportaciones en función del PIB
document.getElementById('exports-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            var exports = exportsData[countryName];
            if (exports !== undefined) {
                layer.setStyle({
                    fillColor: getExportsColor(exports),
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getExportsColor(exports);
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});

// Evento para la casilla de verificación de importaciones en función del PIB
document.getElementById('imports-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            var imports = importsData[countryName];
            if (imports !== undefined) {
                layer.setStyle({
                    fillColor: getImportsColor(imports),
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getImportsColor(imports);
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});

// Evento para la casilla de verificación del tipo de gobierno
document.getElementById('government-type-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            var governmentType = governmentTypeData[countryName];
            if (governmentType !== undefined) {
                layer.setStyle({
                    fillColor: getGovernmentTypeColor(governmentType),
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getGovernmentTypeColor(governmentType);
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});

// Evento para la casilla de verificación del índice de democracia
document.getElementById('democracy-index-checkbox').addEventListener('change', function() {
    if (this.checked) {
        geojson.eachLayer(function(layer) {
            var countryName = layer.feature.properties.ADMIN;
            var democracyIndex = democracyIndexData[countryName];
            if (democracyIndex !== undefined) {
                layer.setStyle({
                    fillColor: getDemocracyIndexColor(democracyIndex),
                    fillOpacity: 0.7,
                    color: '#000',
                    weight: 1
                });
                layer.options.originalColor = getDemocracyIndexColor(democracyIndex);
            }
        });
    } else {
        geojson.eachLayer(function(layer) {
            geojson.resetStyle(layer);
            if (layer.options.originalColor) {
                layer.setStyle({
                    fillColor: layer.options.originalColor
                });
            }
        });
    }
});
function showCountryIndices(countryName) {
    const countryData = countryInfo[countryName];
    if (!countryData) return;

    const indices = {
        hdi: 'IDH',
        density: 'Densidad de Población',
        gdp: 'PIB',
        exports: 'Exportaciones en función del PIB',
        imports: 'Importaciones en función del PIB',
        unemployment: 'Desempleo',
        governmentType: 'Tipo de Gobierno',
        democracyIndex: 'Índice de Democracia'
    };

    let indicesHTML = '<h2 id="indices-title">Posición en Índices</h2>';
    for (const [key, label] of Object.entries(indices)) {
        if (countryData[key] !== undefined) {
            indicesHTML += `<p><strong>${label}:</strong> ${countryData[key]}</p>`;
        } else {
            indicesHTML += `<p><strong>${label}:</strong> N/A</p>`;
        }
    }

    document.getElementById('country-info').innerHTML += indicesHTML;
}

// Modificar la función onEachFeature para incluir la llamada a showCountryIndices
function onEachFeature(feature, layer) {
    layer.on({
        click: function (e) {
            var countryName = feature.properties.ADMIN;
            var info = countryInfo[countryName] || {};

            var infoHTML = `
                <h2 id="info-title">Información General</h2>
                <p><strong>Capital:</strong> ${info.capital || "N/A"}</p>
                <p><strong>Población:</strong> ${info.population || "N/A"}</p>
                <p><strong>Idiomas oficiales:</strong> ${info.officialLanguages || "N/A"}</p>
                <p><strong>Moneda:</strong> ${info.currency || "N/A"}</p>
            `;

            document.getElementById('country-title').innerText = info.officialName || countryName;
            document.getElementById('country-info').innerHTML = infoHTML;
            document.getElementById('sidebar').classList.remove('hidden'); // Mostrar el sidebar

            // Mostrar la información de los índices
            showCountryIndices(countryName);

            var bounds = layer.getBounds();
            map.fitBounds(bounds);
        },
        mouseover: highlightOnHover,
        mouseout: resetHighlightOnHover
    });
}
