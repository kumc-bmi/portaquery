declare class _QT {
    doQueryClear(): void;
};

declare class _ctrlr {
    QT: _QT;
};

declare class _CRC {
    ctrlr: _ctrlr;
};

declare class _LoadingMask {
    hide(): void;
    show(): void;
}

declare class _Node {
};

declare class _h {
    LoadingMask: _LoadingMask;
    XPath(xml: Node, expr: string): Array<Node>;
    getXNodeVal(xml: Node, expr: string): string;
};

declare class _Master {
    EncapsulateData(sort: string, o: any): any;
}

declare class _sdx {
    Master: _Master;
};

declare class PlugIn$View {
    containerDiv: Node;
};

declare class _PlugIn {
    Init(loadedDiv: Node): void;
    view: PlugIn$View;
};

declare class _I2B2 {
    CRC: any;
    h: _h;
    sdx: _sdx;
    PortQuery: _PlugIn;
};

declare var i2b2: _I2B2;

declare class i2b2_scopedCallback {
    scope: any;
}
