// realm.service.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import Realm from 'realm';

const execAsync = promisify(exec);

export class RealmService {
    private readonly dataDir: string;

    constructor(dataDir: string = path.join(process.cwd(), 'data')) {
        this.dataDir = dataDir;
    }

    private ensureDataDir(): void {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    async findRealmFiles(pkg: string): Promise<string[]> {
        const { stdout } = await execAsync(
            `adb shell run-as ${pkg} find /data/data/${pkg} -name "*.realm" -not -name "*.lock"`
        );
        return stdout.split('\n').map((l) => l.trim()).filter(Boolean);
    }

    async pullRealmFile(pkg: string, remotePath: string): Promise<string> {
        this.ensureDataDir();

        const fileName = path.basename(remotePath); // default.realm
        const localPath = path.join(this.dataDir, fileName);

        await execAsync(
            `adb exec-out run-as ${pkg} cat "${remotePath}" > "${localPath}"`
        );

        return localPath;
    }

    // resolve o path local, puxando do device se não existir em cache
    async resolveLocalRealmPath(pkg: string, fileName?: string): Promise<string> {
        this.ensureDataDir();

        if (fileName) {
            const cachedPath = path.join(this.dataDir, fileName);
            if (fs.existsSync(cachedPath)) {
                return cachedPath;
            }
        }

        const remoteFiles = await this.findRealmFiles(pkg);

        if (remoteFiles.length === 0) {
            throw new Error(`Nenhum arquivo .realm encontrado no pacote ${pkg}`);
        }

        const targetRemote = fileName
            ? remoteFiles.find((f) => f.endsWith(fileName))
            : remoteFiles[0];

        if (!targetRemote) {
            throw new Error(
                `Arquivo "${fileName}" não encontrado no device. Disponíveis: ${remoteFiles.join(', ')}`
            );
        }

        return this.pullRealmFile(pkg, targetRemote);
    }

    private async openRealm(localPath: string) {
        return Realm.open({ path: localPath }); // modo dinâmico
    }

    async readSchema(pkg: string, fileName?: string) {
        const localPath = await this.resolveLocalRealmPath(pkg, fileName);
        const realm = await this.openRealm(localPath);
        try {
            return realm.schema.map((s) => ({
                name: s.name,
                properties: Object.keys(s.properties),
                count: realm.objects(s.name).length,
            }));
        } finally {
            realm.close();
        }
    }

    async readAllTables(pkg: string, fileName?: string) {
        const localPath = await this.resolveLocalRealmPath(pkg, fileName);
        const realm = await this.openRealm(localPath);
        try {
            const result: Record<string, any[]> = {};
            for (const s of realm.schema) {
                result[s.name] = realm.objects(s.name).map((obj: any) => obj.toJSON());
            }
            return result;
        } finally {
            realm.close();
        }
    }

    async readTableNames(pkg: string, fileName?: string) {
        const localPath = await this.resolveLocalRealmPath(pkg, fileName);
        const realm = await this.openRealm(localPath);
        try {
            return {
                pacote: pkg,
                tabelas: realm.schema.map((s) => s.name),
            };
        } finally {
            realm.close();
        }
    }

    async readTable(pkg: string, tableName: string, fileName?: string) {
        const localPath = await this.resolveLocalRealmPath(pkg, fileName);
        const realm = await this.openRealm(localPath);
        try {
            if (!realm.schema.find((s) => s.name === tableName)) {
                throw new Error(`Tabela "${tableName}" não existe nesse Realm`);
            }
            return realm.objects(tableName).map((obj: any) => obj.toJSON());
        } finally {
            realm.close();
        }
    }

    // ignora cache, sempre puxa de novo do device
    async refreshAndRead(pkg: string, fileName?: string) {
        const remoteFiles = await this.findRealmFiles(pkg);
        if (remoteFiles.length === 0) {
            throw new Error(`Nenhum arquivo .realm encontrado no pacote ${pkg}`);
        }

        const targetRemote = fileName
            ? remoteFiles.find((f) => f.endsWith(fileName))
            : remoteFiles[0];

        if (!targetRemote) {
            throw new Error(`Arquivo "${fileName}" não encontrado no device`);
        }

        const localPath = await this.pullRealmFile(pkg, targetRemote);
        const realm = await this.openRealm(localPath);
        try {
            const result: Record<string, any[]> = {};
            for (const s of realm.schema) {
                result[s.name] = realm.objects(s.name).map((obj: any) => obj.toJSON());
            }

           if(result){
               return {

                       realmSuccess:"banco de dados atualizado com sucesso."

               }



           }else{
               return "Houve um erro ao atualizar o banco de dados."
           }
        } finally {
            realm.close();
        }
    }

    async readTableColumns(pkg: string, tableName: string, fileName?: string) {
        const localPath = await this.resolveLocalRealmPath(pkg, fileName);
        const realm = await this.openRealm(localPath);
        try {
            const schema = realm.schema.find((s) => s.name === tableName);

            if (!schema) {
                throw new Error(`Tabela "${tableName}" não existe nesse Realm`);
            }

            const columns = Object.entries(schema.properties).map(([name, prop]: [string, any]) => ({
                nome: name,
                tipo: prop.type,
                opcional: prop.optional ?? false,
                indexado: prop.indexed ?? false,
                chavePrimaria: schema.primaryKey === name,
            }));

            return {
                pacote: pkg,
                tabela: tableName,
                totalColunas: columns.length,
                colunas: columns,
            };
        } finally {
            realm.close();
        }
    }

    async readTableFiltered(pkg: string, tableName: string, query: string, fileName?: string) {
        const localPath = await this.resolveLocalRealmPath(pkg, fileName);
        const realm = await this.openRealm(localPath);
        try {
            if (!realm.schema.find((s) => s.name === tableName)) {
                throw new Error(`Tabela "${tableName}" não existe nesse Realm`);
            }

            const results = realm.objects(tableName).filtered(query);
            return results.map((obj: any) => obj.toJSON());
        } catch (err) {
            throw new Error(`Query inválida: ${String(err)}`);
        } finally {
            realm.close();
        }
    }
}

export default new RealmService();