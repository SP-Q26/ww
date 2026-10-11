import './styleCompiler/ww-style-page-385ba910-fe19-436b-a205-edc2ec8b88a7.css';
/*__WW_PAGE_COMPONENT_IMPORTS_START__*/

// eslint-disable-next-line no-undef
import element_1b1e2173_9b78_42cc_a8ee_a6167caea340 from "@weweb-internal/ext-element-1b1e2173-9b78-42cc-a8ee-a6167caea340";
import element_3a7d6379_12d3_4387_98ff_b332bb492a63 from "@weweb-internal/ext-element-3a7d6379-12d3-4387-98ff-b332bb492a63";
import element_59dca300_db78_42e4_a7a6_0cbf22d3cc82 from "@weweb-internal/ext-element-59dca300-db78-42e4-a7a6-0cbf22d3cc82";
import element_6d692ca2_6cdc_4805_aa0c_211102f335d0 from "@weweb-internal/ext-element-6d692ca2-6cdc-4805-aa0c-211102f335d0";
import element_9ccf84b0_e542_4423_869f_b4828301ec49 from "@weweb-internal/ext-element-9ccf84b0-e542-4423-869f-b4828301ec49";
import element_b783dc65_d528_4f74_8c14_e27c934c39b1 from "@weweb-internal/ext-element-b783dc65-d528-4f74-8c14-e27c934c39b1";
import element_c6c0c00e_49fd_4cb9_bd78_5bc09945721e from "@weweb-internal/ext-element-c6c0c00e-49fd-4cb9-bd78-5bc09945721e";
import element_cf63c911_3951_4ab7_ba8f_37e7fa30e09d from "@weweb-internal/ext-element-cf63c911-3951-4ab7-ba8f-37e7fa30e09d";
import element_d7904e9d_fc9a_4d80_9e32_728e097879ad from "@weweb-internal/ext-element-d7904e9d-fc9a-4d80-9e32-728e097879ad";
import element_d97c3ace_d7b5_43e4_870c_8c72ac4a1d02 from "@weweb-internal/ext-element-d97c3ace-d7b5-43e4-870c-8c72ac4a1d02";

// eslint-disable-next-line no-undef
import section_99586bd3_2b15_4d6b_a025_6a50d07ca845 from "@weweb-internal/ext-section-99586bd3-2b15-4d6b-a025-6a50d07ca845";

/*__WW_PAGE_COMPONENT_IMPORTS_END__*/

import { registerSsrPageComponents } from '@/_front/rendering/ssrPageComponents';

let isRegistered = false;

export default async function registerPageComponents(app) {
    if (isRegistered) return;

    if (import.meta.env.SSR) {
        await registerSsrPageComponents(
            app,
            // eslint-disable-next-line no-undef
            /*__WW_SSR_PAGE_COMPONENT_DESCRIPTORS_START__*/
[
    {
        "baseId": "1b1e2173-9b78-42cc-a8ee-a6167caea340",
        "importPath": "@weweb-internal/ext-element-1b1e2173-9b78-42cc-a8ee-a6167caea340",
        "name": "wwobject-1b1e2173-9b78-42cc-a8ee-a6167caea340",
        "type": "element"
    },
    {
        "baseId": "3a7d6379-12d3-4387-98ff-b332bb492a63",
        "importPath": "@weweb-internal/ext-element-3a7d6379-12d3-4387-98ff-b332bb492a63",
        "name": "wwobject-3a7d6379-12d3-4387-98ff-b332bb492a63",
        "type": "element"
    },
    {
        "baseId": "59dca300-db78-42e4-a7a6-0cbf22d3cc82",
        "importPath": "@weweb-internal/ext-element-59dca300-db78-42e4-a7a6-0cbf22d3cc82",
        "name": "wwobject-59dca300-db78-42e4-a7a6-0cbf22d3cc82",
        "type": "element"
    },
    {
        "baseId": "6d692ca2-6cdc-4805-aa0c-211102f335d0",
        "importPath": "@weweb-internal/ext-element-6d692ca2-6cdc-4805-aa0c-211102f335d0",
        "name": "wwobject-6d692ca2-6cdc-4805-aa0c-211102f335d0",
        "type": "element"
    },
    {
        "baseId": "9ccf84b0-e542-4423-869f-b4828301ec49",
        "importPath": "@weweb-internal/ext-element-9ccf84b0-e542-4423-869f-b4828301ec49",
        "name": "wwobject-9ccf84b0-e542-4423-869f-b4828301ec49",
        "type": "element"
    },
    {
        "baseId": "b783dc65-d528-4f74-8c14-e27c934c39b1",
        "importPath": "@weweb-internal/ext-element-b783dc65-d528-4f74-8c14-e27c934c39b1",
        "name": "wwobject-b783dc65-d528-4f74-8c14-e27c934c39b1",
        "type": "element"
    },
    {
        "baseId": "c6c0c00e-49fd-4cb9-bd78-5bc09945721e",
        "importPath": "@weweb-internal/ext-element-c6c0c00e-49fd-4cb9-bd78-5bc09945721e",
        "name": "wwobject-c6c0c00e-49fd-4cb9-bd78-5bc09945721e",
        "type": "element"
    },
    {
        "baseId": "cf63c911-3951-4ab7-ba8f-37e7fa30e09d",
        "importPath": "@weweb-internal/ext-element-cf63c911-3951-4ab7-ba8f-37e7fa30e09d",
        "name": "wwobject-cf63c911-3951-4ab7-ba8f-37e7fa30e09d",
        "type": "element"
    },
    {
        "baseId": "d7904e9d-fc9a-4d80-9e32-728e097879ad",
        "importPath": "@weweb-internal/ext-element-d7904e9d-fc9a-4d80-9e32-728e097879ad",
        "name": "wwobject-d7904e9d-fc9a-4d80-9e32-728e097879ad",
        "type": "element"
    },
    {
        "baseId": "d97c3ace-d7b5-43e4-870c-8c72ac4a1d02",
        "importPath": "@weweb-internal/ext-element-d97c3ace-d7b5-43e4-870c-8c72ac4a1d02",
        "name": "wwobject-d97c3ace-d7b5-43e4-870c-8c72ac4a1d02",
        "type": "element"
    },
    {
        "baseId": "99586bd3-2b15-4d6b-a025-6a50d07ca845",
        "importPath": "@weweb-internal/ext-section-99586bd3-2b15-4d6b-a025-6a50d07ca845",
        "name": "section-99586bd3-2b15-4d6b-a025-6a50d07ca845",
        "type": "section"
    }
]
/*__WW_SSR_PAGE_COMPONENT_DESCRIPTORS_END__*/
        );
    } else {
        // eslint-disable-next-line no-undef
        app.component("wwobject-1b1e2173-9b78-42cc-a8ee-a6167caea340", element_1b1e2173_9b78_42cc_a8ee_a6167caea340);
app.component("wwobject-3a7d6379-12d3-4387-98ff-b332bb492a63", element_3a7d6379_12d3_4387_98ff_b332bb492a63);
app.component("wwobject-59dca300-db78-42e4-a7a6-0cbf22d3cc82", element_59dca300_db78_42e4_a7a6_0cbf22d3cc82);
app.component("wwobject-6d692ca2-6cdc-4805-aa0c-211102f335d0", element_6d692ca2_6cdc_4805_aa0c_211102f335d0);
app.component("wwobject-9ccf84b0-e542-4423-869f-b4828301ec49", element_9ccf84b0_e542_4423_869f_b4828301ec49);
app.component("wwobject-b783dc65-d528-4f74-8c14-e27c934c39b1", element_b783dc65_d528_4f74_8c14_e27c934c39b1);
app.component("wwobject-c6c0c00e-49fd-4cb9-bd78-5bc09945721e", element_c6c0c00e_49fd_4cb9_bd78_5bc09945721e);
app.component("wwobject-cf63c911-3951-4ab7-ba8f-37e7fa30e09d", element_cf63c911_3951_4ab7_ba8f_37e7fa30e09d);
app.component("wwobject-d7904e9d-fc9a-4d80-9e32-728e097879ad", element_d7904e9d_fc9a_4d80_9e32_728e097879ad);
app.component("wwobject-d97c3ace-d7b5-43e4-870c-8c72ac4a1d02", element_d97c3ace_d7b5_43e4_870c_8c72ac4a1d02);

        // eslint-disable-next-line no-undef
        app.component("section-99586bd3-2b15-4d6b-a025-6a50d07ca845", section_99586bd3_2b15_4d6b_a025_6a50d07ca845);
    }

    isRegistered = true;
}
