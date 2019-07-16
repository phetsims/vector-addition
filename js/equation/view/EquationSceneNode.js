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
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  // const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );
  const EquationTypesRadioButtonGroup = require( 'VECTOR_ADDITION/equation/view/EquationTypesRadioButtonGroup' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const BaseVectorsAccordionBox = require( 'VECTOR_ADDITION/equation/view/BaseVectorsAccordionBox' );

  // constants

  const VECTOR_SUM_COLORS = {
    fill: VectorAdditionColors.BLACK,
    component: VectorAdditionColors.GREY
  };

  const PANEL_CENTER_Y = 110;

  class EquationSceneNode extends Node {
    /**
     * @param {EquationModel} equationModel
     * @param {Graph} graph
     * @param {EquationVectorSet} equationVectorSet
     * @param {BooleanProperty} baseVectorVisibleProperty
     * @param {EnumerationProperty.<EquationTypes>} equationTypeProperty
     */
    constructor( equationModel, scene ) {


      super();

      // Add the graphs
      scene.graphs.forEach( graph => {

        const sceneNode = new SceneNode( graph,
          equationModel.valuesVisibleProperty,
          equationModel.angleVisibleProperty,
          equationModel.gridVisibleProperty,
          equationModel.componentStyleProperty, {
            includeEraser: false,
            includeBaseVectors: true,
            sumNodeOptions: VECTOR_SUM_COLORS
          } );

        this.addChild( sceneNode );

        // Toggle visibility, doesn't need to be unlinked since the scene is never disposed
        scene.equationTypeProperty.link( equationType => {
          sceneNode.visible = equationType === graph.equationType;
        } );

        // Add a CoefficientSelectorPanel
        sceneNode.addChild( new CoefficientSelectorPanel( graph.vectorSet, {
          centerY: PANEL_CENTER_Y
        } ) );

        // // Add the base vectors
        // graph.vectorSet.vectors.forEach( vector => {
        //   const baseVector = new VectorNode( vector.baseVector,
        //     scene.additionGraph,
        //     equationModel.valuesVisibleProperty,
        //     equationModel.angleVisibleProperty,
        //     {
        //       opacity: 0.5
        //     } );
        // scene.baseVectorsVisibleProperty.linkAttribute( baseVector, 'visible' );

        // sceneNode.baseVectorContainer.addChild( baseVector );
        // } );

      } );

      //----------------------------------------------------------------------------------------
      // Add the equation types radio button Group

      const equationTypesRadioButtonGroup = new EquationTypesRadioButtonGroup( scene.equationTypeProperty, scene.tags, {
        centerY: PANEL_CENTER_Y
      } );

      this.addChild( equationTypesRadioButtonGroup );

      //----------------------------------------------------------------------------------------

      // Add the base vectors accordion box (semi-global)
      this.addChild( new BaseVectorsAccordionBox( scene.baseVectorsVisibleProperty ) );
    }
  }

  return vectorAddition.register( 'EquationSceneNode', EquationSceneNode );
} );