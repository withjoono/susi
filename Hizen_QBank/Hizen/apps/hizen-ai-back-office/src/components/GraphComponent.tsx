import React, { useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getNodeByKey, NodeKey } from 'lexical';
import functionPlot from 'function-plot';
import { $isGraphNode } from '../nodes/GraphNode';

interface GraphComponentProps {
  functions: string[];
  xDomain: [number, number];
  yDomain: [number, number];
  width: number;
  height: number;
  grid: boolean;
  axes: boolean;
  title: string;
  xLabel: string;
  yLabel: string;
  nodeKey: NodeKey;
}

interface GraphEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: GraphConfig) => void;
  initialConfig: GraphConfig;
}

interface GraphConfig {
  functions: string[];
  xDomain: [number, number];
  yDomain: [number, number];
  width: number;
  height: number;
  grid: boolean;
  axes: boolean;
  title: string;
  xLabel: string;
  yLabel: string;
}

const GraphEditModal: React.FC<GraphEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialConfig,
}) => {
  const [config, setConfig] = useState<GraphConfig>(initialConfig);
  const [functionInputs, setFunctionInputs] = useState<string[]>(
    initialConfig.functions.length > 0 ? initialConfig.functions : ['']
  );

  const handleAddFunction = () => {
    setFunctionInputs([...functionInputs, '']);
  };

  const handleRemoveFunction = (index: number) => {
    const newInputs = functionInputs.filter((_, i) => i !== index);
    setFunctionInputs(newInputs);
    setConfig({
      ...config,
      functions: newInputs.filter(f => f.trim() !== ''),
    });
  };

  const handleFunctionChange = (index: number, value: string) => {
    const newInputs = [...functionInputs];
    newInputs[index] = value;
    setFunctionInputs(newInputs);
    setConfig({
      ...config,
      functions: newInputs.filter(f => f.trim() !== ''),
    });
  };

  const handleSave = () => {
    onSave({
      ...config,
      functions: functionInputs.filter(f => f.trim() !== ''),
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">그래프 편집</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* 함수 입력 */}
          <div>
            <label className="block text-sm font-medium mb-2">함수</label>
            {functionInputs.map((func, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={func}
                  onChange={(e) => handleFunctionChange(index, e.target.value)}
                  placeholder="예: x^2, sin(x), cos(x)"
                  className="flex-1 border border-gray-300 rounded px-3 py-2"
                />
                {functionInputs.length > 1 && (
                  <button
                    onClick={() => handleRemoveFunction(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={handleAddFunction}
              className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              함수 추가
            </button>
          </div>

          {/* 범위 설정 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">X 범위</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={config.xDomain[0]}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      xDomain: [parseFloat(e.target.value), config.xDomain[1]],
                    })
                  }
                  className="w-20 border border-gray-300 rounded px-2 py-1"
                  placeholder="최소"
                />
                <span>~</span>
                <input
                  type="number"
                  value={config.xDomain[1]}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      xDomain: [config.xDomain[0], parseFloat(e.target.value)],
                    })
                  }
                  className="w-20 border border-gray-300 rounded px-2 py-1"
                  placeholder="최대"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Y 범위</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={config.yDomain[0]}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      yDomain: [parseFloat(e.target.value), config.yDomain[1]],
                    })
                  }
                  className="w-20 border border-gray-300 rounded px-2 py-1"
                  placeholder="최소"
                />
                <span>~</span>
                <input
                  type="number"
                  value={config.yDomain[1]}
                  onChange={(e) =>
                    setConfig({
                      ...config,
                      yDomain: [config.yDomain[0], parseFloat(e.target.value)],
                    })
                  }
                  className="w-20 border border-gray-300 rounded px-2 py-1"
                  placeholder="최대"
                />
              </div>
            </div>
          </div>

          {/* 크기 설정 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">너비</label>
              <input
                type="number"
                value={config.width}
                onChange={(e) =>
                  setConfig({ ...config, width: parseInt(e.target.value) })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">높이</label>
              <input
                type="number"
                value={config.height}
                onChange={(e) =>
                  setConfig({ ...config, height: parseInt(e.target.value) })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          {/* 라벨 설정 */}
          <div>
            <label className="block text-sm font-medium mb-2">제목</label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="그래프 제목"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">X축 라벨</label>
              <input
                type="text"
                value={config.xLabel}
                onChange={(e) =>
                  setConfig({ ...config, xLabel: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Y축 라벨</label>
              <input
                type="text"
                value={config.yLabel}
                onChange={(e) =>
                  setConfig({ ...config, yLabel: e.target.value })
                }
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          {/* 옵션 설정 */}
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.grid}
                onChange={(e) => setConfig({ ...config, grid: e.target.checked })}
                className="mr-2"
              />
              격자 표시
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={config.axes}
                onChange={(e) => setConfig({ ...config, axes: e.target.checked })}
                className="mr-2"
              />
              축 표시
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

const GraphComponent: React.FC<GraphComponentProps> = ({
  functions,
  xDomain,
  yDomain,
  width,
  height,
  grid,
  axes,
  title,
  xLabel,
  yLabel,
  nodeKey,
}) => {
  const [editor] = useLexicalComposerContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plotGraph = () => {
    if (!containerRef.current) return;

    try {
      // Clear previous graph
      containerRef.current.innerHTML = '';
      
      const data = functions.map((fn, index) => ({
        fn: fn,
        color: `hsl(${index * 60}, 70%, 50%)`,
        graphType: 'polyline' as const,
      }));

      functionPlot({
        target: containerRef.current,
        width,
        height,
        grid,
        xAxis: {
          label: xLabel,
          domain: xDomain,
        },
        yAxis: {
          label: yLabel,
          domain: yDomain,
        },
        title,
        data,
        disableZoom: true,
        annotations: axes ? [] : undefined,
      });
      
      setError(null);
    } catch (err) {
      console.error('Graph plotting error:', err);
      setError('그래프를 그리는 중 오류가 발생했습니다.');
      if (containerRef.current) {
        containerRef.current.innerHTML = `<div class="text-red-500 p-4">그래프 오류: ${err instanceof Error ? err.message : '알 수 없는 오류'}</div>`;
      }
    }
  };

  useEffect(() => {
    plotGraph();
  }, [functions, xDomain, yDomain, width, height, grid, axes, title, xLabel, yLabel]);

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  const handleSave = (config: GraphConfig) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isGraphNode(node)) {
        node.setFunctions(config.functions);
        node.setXDomain(config.xDomain);
        node.setYDomain(config.yDomain);
        node.setWidth(config.width);
        node.setHeight(config.height);
        node.setGrid(config.grid);
        node.setAxes(config.axes);
        node.setTitle(config.title);
        node.setXLabel(config.xLabel);
        node.setYLabel(config.yLabel);
      }
    });
  };

  const currentConfig: GraphConfig = {
    functions,
    xDomain,
    yDomain,
    width,
    height,
    grid,
    axes,
    title,
    xLabel,
    yLabel,
  };

  return (
    <>
      <div
        className="graph-container border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition-colors"
        onClick={handleEdit}
        style={{ width: width + 40, height: height + 80 }}
      >
        {title && (
          <h3 className="text-center font-semibold mb-2 text-sm">{title}</h3>
        )}
        <div
          ref={containerRef}
          className="graph-plot"
          style={{ width, height }}
        />
        {error && (
          <div className="text-red-500 text-sm mt-2 text-center">{error}</div>
        )}
        <div className="text-center text-xs text-gray-500 mt-2">
          클릭하여 편집
        </div>
      </div>

      <GraphEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialConfig={currentConfig}
      />
    </>
  );
};

export default GraphComponent; 