/**
 * api-client.js
 * Builds the structured DispatchPayload and returns a mocked API response.
 */

export const postDispatchIntent = async (rawForm) => {
    const payload = {
        role: "dispatcher",
        patientInfo: {
            name: [rawForm.patient_first_name, rawForm.patient_middle_name, rawForm.patient_last_name]
                      .filter(Boolean).join(' ') || rawForm.caller_name || "Unknown",
            age:  rawForm.approx_age === "infant" ? 1
                : rawForm.approx_age === "child"  ? 10
                : rawForm.approx_age === "teen"   ? 15
                : null,
            sex:        rawForm.sex             || null,
            condition:  rawForm.medical_history || null,
            identifiers: rawForm.id_number ? [rawForm.id_number] : []
        },
        incidentInfo: {
            type:     rawForm.incident_type     || "single",
            priority: rawForm.priority_level    || "low",
            location: {
                address: rawForm.incident_location  || null,
                zone:    rawForm.incident_landmark  || null
            },
            notes: rawForm.incident_description || ""
        },
        logistics: {
            ambulanceId: rawForm.assign_ambulance  || null,
            facilityId:  rawForm.health_facility   || null,
            resources:   rawForm.multi_agency
                ? (Array.isArray(rawForm.multi_agency) ? rawForm.multi_agency : [rawForm.multi_agency])
                : []
        },
        rawForm
    };

    console.log("[EMListen] Mock dispatch payload →", payload);

    await new Promise(resolve => setTimeout(resolve, 300));

    const mockResponse = {
        status: 'ok',
        message: 'Mock dispatch accepted',
        payload
    };

    console.log("[EMListen] Mock gateway response:", mockResponse);
    return mockResponse;
};
