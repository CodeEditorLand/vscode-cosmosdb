/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { AzureExtensionApiProvider } from "@microsoft/vscode-azext-utils/api";
import { Extension, extensions } from "vscode";
import { AzureResourceGroupsExtensionApi } from "./api";
import { localize } from "./utils/localize";

export async function getApiExport<T>(extensionId: string): Promise<T | undefined> {
    const extension: Extension<T> | undefined = extensions.getExtension(extensionId);
    if (extension) {
        if (!extension.isActive) {
            await extension.activate();
        }

        return extension.exports;
    }

    return undefined;
}

export async function getResourceGroupsApi(): Promise<AzureResourceGroupsExtensionApi> {
    const rgApiProvider = await getApiExport<AzureExtensionApiProvider>('ms-azuretools.vscode-azureresourcegroups');
    if (rgApiProvider) {
        return rgApiProvider.getApi<AzureResourceGroupsExtensionApi>('0.0.1');
    } else {
        throw new Error(localize('noResourceGroupExt', 'Could not find the Azure Resource Groups extension'));
    }
}
