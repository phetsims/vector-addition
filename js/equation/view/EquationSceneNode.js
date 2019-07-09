// Copyright 2019, University of Colorado Boulder

/**
 * The scene node for the 'Equation' screen. Equation scenes have:
 *  - a Graph Node
 *  - a Equation Selector Radio Button Group
 *  - a Coefficient Selector Panel
 *  - a Base Vector Accordion Box
 *  - VectorNodes for one VectorSet
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const CoefficientSelectorPanel = require( 'VECTOR_ADDITION/equation/view/CoefficientSelectorPanel' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const EquationModel = require( 'VECTOR_ADDITION/equation/model/EquationModel' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const EquationVectorSet = require( 'VECTOR_ADDITION/equation/model/EquationVectorSet' );
  const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  const GraphNode = require( 'VECTOR_ADDITION/common/view/GraphNode' );
  const InspectVectorPanel = require( 'VECTOR_ADDITION/common/view/InspectVectorPanel' );
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorComponentNode = require( 'VECTOR_ADDITION/common/view/VectorComponentNode' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );
  const VectorSumComponentNode = require( 'VECTOR_ADDITION/common/view/VectorSumComponentNode' );
  const EquationTypesRadioButtonGroup = require( 'VECTOR_ADDITION/equation/view/EquationTypesRadioButtonGroup' );
  const EquationVectorNode = require( 'VECTOR_ADDITION/equation/view/EquationVectorNode' );

  // constants

  const VECTOR_SUM_COLORS = {
    fill: VectorAdditionColors.BLACK,
    component: VectorAdditionColors.GREY
  };

  class EquationSceneNode extends Node {
    /**
     * @param {EquationModel} equationModel
     * @param {Graph} graph
     * @param {EquationVectorSet} equationVectorSet
     * @param {BooleanProperty} baseVectorVisibleProperty
     * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty
     * @constructor
     */
    constructor( equationModel,
                 graph,
                 equationVectorSet,
                 baseVectorVisibleProperty,
                 equationTypeProperty
    ) {

      assert && assert( equationModel instanceof EquationModel, `invalid equationModel: ${equationModel}` );
      assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      assert && assert( equationVectorSet instanceof EquationVectorSet,
        `invalid equationVectorSet: ${equationVectorSet}` );
      assert && assert( equationTypeProperty instanceof EnumerationProperty
      && EquationTypes.includes( equationTypeProperty.value ),
        `invalid equationTypeProperty: ${equationTypeProperty}` );

      //----------------------------------------------------------------------------------------
      // Create the scenery nodes

      const graphNode = new GraphNode( graph, equationModel.gridVisibleProperty );

      const inspectVectorPanel = new InspectVectorPanel( graph );


      // Create the containers for each vector type
      const vectorContainer = new Node();
      const vectorComponentContainer = new Node();
      const baseVectorContainer = new Node();
      const coefficientSelectorPanel = new CoefficientSelectorPanel( equationVectorSet, equationTypeProperty );

      const equationTypesRadioButtonGroup = new EquationTypesRadioButtonGroup( equationTypeProperty, equationVectorSet, {
        centerY: coefficientSelectorPanel.centerY
      } );

      super( {
        children: [
          graphNode,
          inspectVectorPanel,
          baseVectorContainer,
          vectorComponentContainer,
          vectorContainer,
          coefficientSelectorPanel,
          equationTypesRadioButtonGroup
        ]
      } );

      //----------------------------------------------------------------------------------------
      // Create the vector sum nodes
      const vectorSumNode = new VectorNode( equationVectorSet.vectorSum,
        graph,
        equationModel.valuesVisibleProperty,
        equationModel.angleVisibleProperty, {
          fill: VECTOR_SUM_COLORS.fill
        }
      );

      const xComponentSumNode = new VectorSumComponentNode( equationVectorSet.vectorSum.xVectorComponentModel,
        graph,
        equationModel.componentStyleProperty,
        equationModel.valuesVisibleProperty,
        equationVectorSet.sumVisibleProperty, {
          arrowOptions: { fill: VECTOR_SUM_COLORS.component }
        } );

      const yComponentSumNode = new VectorSumComponentNode( equationVectorSet.vectorSum.yVectorComponentModel,
        graph,
        equationModel.componentStyleProperty,
        equationModel.valuesVisibleProperty,
        equationVectorSet.sumVisibleProperty, {
          arrowOptions: { fill: VECTOR_SUM_COLORS.component }
        } );

      vectorComponentContainer.addChild( xComponentSumNode );
      vectorComponentContainer.addChild( yComponentSumNode );
      vectorContainer.addChild( vectorSumNode );

      //----------------------------------------------------------------------------------------

      // Add the rest of the vectors
      equationVectorSet.vectors.forEach( vector => {

        const vectorNode = new EquationVectorNode( vector,
          graph,
          equationModel.valuesVisibleProperty,
          equationModel.angleVisibleProperty );

        const xComponentNode = new VectorComponentNode( vector.xVectorComponentModel,
          graph,
          equationModel.componentStyleProperty,
          equationModel.valuesVisibleProperty );

        const yComponentNode = new VectorComponentNode( vector.yVectorComponentModel,
          graph,
          equationModel.componentStyleProperty,
          equationModel.valuesVisibleProperty );

        const baseVector = new VectorNode( vector.baseVector, graph,
          equationModel.valuesVisibleProperty,
          equationModel.angleVisibleProperty,
          {
            opacity: 0.5
          } );
        vectorComponentContainer.addChild( xComponentNode );
        vectorComponentContainer.addChild( yComponentNode );
        baseVectorContainer.addChild( baseVector );
        vectorContainer.addChild( vectorNode );
      } );

      // @private {function} function to reset the scene
      this.resetScene = () => {
        graph.reset();
      };
    }

    /**
     * Resets the scene
     * @public
     */
    reset() {
      this.resetScene();
    }
  }

  return vectorAddition.register( 'EquationSceneNode', EquationSceneNode );
} );