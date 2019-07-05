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
  // const BooleanProperty = require( 'AXON/BooleanProperty' );
  // const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  // const EquationModel = require( 'VECTOR_ADDITION/equation/model/EquationModel' );
  // const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );  
  // const EquationVectorSet = require( 'VECTOR_ADDITION/equation/model/EquationVectorSet' );
  // const EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  // const Graph = require( 'VECTOR_ADDITION/common/model/Graph' );
  // const GraphNode = require( 'VECTOR_ADDITION/common/view/GraphNode' );
  // const InspectVectorPanel = require( 'VECTOR_ADDITION/common/view/InspectVectorPanel' );
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  // const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  // const VectorComponentNode = require( 'VECTOR_ADDITION/common/view/VectorComponentNode' );
  // const VectorCreatorPanel = require( 'VECTOR_ADDITION/common/view/VectorCreatorPanel' );
  // const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );

  // constants
  // const INSPECT_VECTOR_PANEL_OPTIONS = {
  //   panelOptions: {
  //     left: 195,
  //     top: 12
  //   }
  // };

  // const VECTOR_SUM_COLORS = {
  //   fill: VectorAdditionColors.BLACK,
  //   component: VectorAdditionColors.LIGHT_GREY
  // };

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

      // assert && assert( equationModel instanceof EquationModel, `invalid equationModel: ${equationModel}` );
      // assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      // assert && assert( equationVectorSet instanceof EquationVectorSet,
      //   `invalid equationVectorSet: ${equationVectorSet}` );
      // assert && assert( equationTypeProperty instanceof EnumerationProperty
      //   && EquationTypes.includes( equationTypeProperty.value ),
      // `invalid equationTypeProperty: ${equationTypeProperty}` );
      // assert && assert( !inspectPanelOptions || Object.getPrototypeOf( inspectPanelOptions ) === Object.prototype,
      //   `Extra prototype on inspectPanelOptions: ${inspectPanelOptions}` );

      // //----------------------------------------------------------------------------------------
      // // Create the scenery nodes

      // const graphNode = new GraphNode( graph, equationModel.gridVisibleProperty );

      // const inspectVectorPanel = new InspectVectorPanel( graph, INSPECT_VECTOR_PANEL_OPTIONS );


      // // Create the containers for each vector type
      // const vectorContainer = new Node();
      // const vectorComponentContainer = new Node();

      // super( {
      //   children: [
      //     graphNode,
      //     inspectVectorPanel,
      //     vectorComponentContainer,
      //     vectorContainer
      //   ]
      // } );

      // //----------------------------------------------------------------------------------------
      // // Create the vector sum nodes
      // const vectorSumNode = new VectorSumNode( equationVectorSet.vectorSum,
      //   graph,
      //   equationModel.valuesVisibleProperty,
      //   equationModel.angleVisibleProperty,
      //   equationVectorSet.sumVisibleProperty, {
      //     fill: VECTOR_SUM_COLORS.fill
      //   }
      // );

      // const xComponentSumNode = new VectorSumComponentNode( equationVectorSet.vectorSum.xVectorComponentModel,
      //   graph,
      //   equationModel.componentStyleProperty,
      //   equationModel.valuesVisibleProperty,
      //   equationVectorSet.sumVisibleProperty, {
      //     fill: VECTOR_SUM_COLORS.component
      //   } );

      // const yComponentSumNode = new VectorSumComponentNode( equationVectorSet.vectorSum.yVectorComponentModel,
      //   graph,
      //   equationModel.componentStyleProperty,
      //   equationModel.valuesVisibleProperty,
      //   equationVectorSet.sumVisibleProperty, {
      //     fill: VECTOR_SUM_COLORS.component
      //   } );

      // //----------------------------------------------------------------------------------------

      // // Add the rest of the vectors
      // equationVectorSet.vectors.forEach( vector => {


      //   const vectorNode = new Vector( vector, graph, equationModel.valuesVisibleProperty, equationModel.angleVisibleProperty );
      // } );
      //   ---------------------------------------------------------------------------*
      //    * Observe changes to the vector set, and update the scene
      //    *---------------------------------------------------------------------------
      //   equationVectorSet.vectors.addItemAddedListener( ( addedVector ) => {
      //     // There isn't a need to remove the addItemAddedListener since equationVectorSets are never disposed
      //     const xComponentNode = new VectorComponentNode( addedVector.xVectorComponentModel,
      //       graph,
      //       componentStyleProperty,
      //       valuesVisibleProperty );

      //     const yComponentNode = new VectorComponentNode( addedVector.yVectorComponentModel,
      //       graph,
      //       componentStyleProperty,
      //       valuesVisibleProperty );

      //     vectorComponentContainer.addChild( xComponentNode );
      //     vectorComponentContainer.addChild( yComponentNode );

      //     //----------------------------------------------------------------------------------------
      //     // Add the removal listener for when the vector is removed
      //     const removalListener = removedVector => {
      //       if ( removedVector === addedVector ) {

      //         xComponentNode.dispose();
      //         yComponentNode.dispose();

      //         equationVectorSet.vectors.removeItemRemovedListener( removalListener );
      //       }
      //     };

      //     equationVectorSet.vectors.addItemRemovedListener( removalListener );
      //   } );
      // } );

      // // @private {function} function to reset the scene
      // this.resetScene = () => {
      //   graph.reset();
      // };
      super();
    }

    /**
     * Resets the scene
     * @public
     */
    reset() {
      // this.resetScene();
    }

    /**
     * Adds a Vector Creator Panel to the scene
     * @param {VectorCreatorPanel} vectorCreatorPanel
     */
    addVectorCreatorPanel( vectorCreatorPanel ) {

      // assert && assert( vectorCreatorPanel instanceof VectorCreatorPanel,
      //   `invalid vectorCreatorPanel: ${vectorCreatorPanel}` );
      // this.addChild( vectorCreatorPanel );
      // vectorCreatorPanel.moveToBack();
    }
  }

  return vectorAddition.register( 'EquationSceneNode', EquationSceneNode );
} );