import { Request, Response } from "express";
import { AdbService } from "../services/adb.service";
import {QualityService} from "../services/Quality.service";
import {RealmService} from "../services/realm.service";

const adb = new AdbService();
const realm = new RealmService();
export class AnalyticsController {

    async meminfo(req: Request, res: Response) {
        try {
            const packageName = req.query.package as string;

            res.json(await adb.meminfo(packageName));
        } catch (err) {
            res.status(500).json({error: "Falha ao ler meminfo", details: String(err)});
        }
    }

    async gfxinfo(req: Request, res: Response) {
        try {
            const packageName = req.query.package as string;

            res.json(await adb.gfxinfo(packageName));
        } catch (err) {
            res.status(500).json({error: "Falha ao ler gfxinfo", details: String(err)});
        }
    }

    async cpu(req: Request, res: Response) {
        try {
            const packageName = req.query.package as string;

            res.json(await adb.cpu(packageName));
        } catch (err) {
            res.status(500).json({error: "Falha ao ler cpuinfo", details: String(err)});
        }
    }

    async battery(req: Request, res: Response) {
        try {
            const packageName = req.query.package as string;

            res.json(await adb.battery(packageName));
        } catch (err) {
            res.status(500).json({error: "Falha ao ler battery", details: String(err)});
        }
    }

    async pid(req: Request, res: Response) {
        try {
            const packageName = req.query.package as string;

            res.json(await adb.pid(packageName));
        } catch (err) {
            res.status(500).json({error: "Falha ao ler pid", details: String(err)});
        }
    }

    async quality(req: Request, res: Response) {
        try {
            const packageName = req.query.package as string;

            res.json(await adb.qualityInfo(packageName));
        } catch (err) {
            res.status(500).json({error: "Falha ao calcular quality", details: String(err)});
        }
    }

    async network(req: Request, res: Response) {
        try {
            const packageName = req.query.package as string;
            const data = await adb.network(packageName);
            res.json(data);
        } catch (err) {
            res.status(500).json({error: "Falha ao calcular quality", details: String(err)});
        }
    }

    async appInfo(req: Request, res: Response) {
        try {
            const packageName = req.query.package as string;
            const data = await adb.appInfo(packageName);
            res.json(data);
        } catch (err) {
            res.status(500).json({error: "Falha ao carregar informação do pacote", details: String(err)});

        }
    }

    async processesInfo(req: Request, res: Response) {
        try {
            const data = await adb.processes();
            res.json(data.data);
        } catch (err) {
            res.status(500).json({error: "Falha ao carregar informação do pacote", details: String(err)});

        }
    }

    async promptRequest(req: Request, res: Response) {
        try {
            const {prompt, packageName} = req.body;

            if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
                return res.status(400).json({error: "O campo 'prompt' é obrigatório e deve ser uma string."});
            }

            const data = await adb.promptRequest(prompt, packageName);
            return res.status(200).json(data);
        } catch (err) {
            console.error("[promptRequest] erro:", err);
            return res.status(500).json({
                error: "Falha ao capturar o prompt",
                details: String(err) // temporário, sem a checagem de NODE_ENV
            });
        }
    }

    async realmTableColumns(req: Request, res: Response) {
        try {
            const pkg = req.query.package as string;
            const table = req.query.table as string;
            const fileName = req.query.file as string;

            if (!pkg) {
                return res.status(400).json({ error: "Parâmetro 'package' é obrigatório" });
            }
            if (!table) {
                return res.status(400).json({ error: "Parâmetro 'table' é obrigatório" });
            }

            const data = await realmService.readTableColumns(pkg, table, fileName);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: "Falha ao carregar colunas da tabela", details: String(err) });
        }
    }

    async realmAccess(req: Request, res: Response) {
        try {
            const pkg = req.query.package as string;
            const fileName = req.query.file as string;

            if (!pkg) {
                return res.status(400).json({ error: "Parâmetro 'package' é obrigatório" });
            }

            const data = await realm.readAllTables(pkg, fileName);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: "Falha ao carregar dados do Realm", details: String(err) });
        }
    }

    async realmSchema(req: Request, res: Response) {
        try {
            const pkg = req.query.package as string;
            const fileName = req.query.file as string;

            if (!pkg) {
                return res.status(400).json({ error: "Parâmetro 'package' é obrigatório" });
            }

            const schema = await realm.readSchema(pkg, fileName);
            res.json(schema);
        } catch (err) {
            res.status(500).json({ error: "Falha ao carregar schema do Realm", details: String(err) });
        }
    }

    async realmTable(req: Request, res: Response) {
        try {
            const pkg = req.query.package as string;
            const table = req.query.table as string;
            const fileName = req.query.file as string;

            if (!pkg) {
                return res.status(400).json({ error: "Parâmetro 'package' é obrigatório" });
            }
            if (!table) {
                return res.status(400).json({ error: "Parâmetro 'table' é obrigatório" });
            }

            const data = await realm.readTable(pkg, table, fileName);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: "Falha ao carregar tabela", details: String(err) });
        }
    }

    async realmRefresh(req: Request, res: Response) {
        try {
            const pkg = req.query.package as string;
            const fileName = req.query.file as string;

            if (!pkg) {
                return res.status(400).json({ error: "Parâmetro 'package' é obrigatório" });
            }

            const data = await realm.refreshAndRead(pkg, fileName);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: "Falha ao atualizar dados do Realm", details: String(err) });
        }
    }

    async realmDiscover(req: Request, res: Response) {
        try {
            const pkg = req.query.package as string;

            if (!pkg) {
                return res.status(400).json({ error: "Parâmetro 'package' é obrigatório" });
            }

            const files = await realm.findRealmFiles(pkg);
            res.json({ files });
        } catch (err) {
            res.status(500).json({ error: "Falha ao localizar arquivos Realm", details: String(err) });
        }
    }

    async realmTableNames(req: Request, res: Response) {
        try {
            const pkg = req.query.package as string;
            const fileName = req.query.file as string;

            if (!pkg) {
                return res.status(400).json({ error: "Parâmetro 'package' é obrigatório" });
            }

            const data = await realm.readTableNames(pkg, fileName);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: "Falha ao listar tabelas do Realm", details: String(err) });
        }
    }
}