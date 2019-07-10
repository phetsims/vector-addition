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
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const Node = require( 'SCENERY/nodes/Node' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );
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
     * @constructor
     */
    constructor( equationModel,
                 scene
    ) {

      // assert && assert( equationModel instanceof EquationModel, `invalid equationModel: ${equationModel}` );
      // assert && assert( graph instanceof Graph, `invalid graph: ${graph}` );
      // assert && assert( equationVectorSet instanceof EquationVectorSet,
      //   `invalid equationVectorSet: ${equationVectorSet}` );
      // assert && assert( equationTypeProperty instanceof EnumerationProperty
      // && EquationTypes.includes( equationTypeProperty.value ),
      //   `invalid equationTypeProperty: ${equationTypeProperty}` );

      super();



      this.additionScene = new SceneNode( scene.additionGraph,
         equationModel.valuesVisibleProperty,
         equationModel.angleVisibleProperty,
         equationModel.gridVisibleProperty,
         equationModel.componentStyleProperty,
         {
          includeEraser: false,
          includeBaseVectors: true,
          sumNodeOptions: VECTOR_SUM_COLORS
         } );
      this.subtractionScene = new SceneNode( scene.subtractionGraph,
         equationModel.valuesVisibleProperty,
         equationModel.angleVisibleProperty,
         equationModel.gridVisibleProperty,
         equationModel.componentStyleProperty,
         {
          includeEraser: false,
          includeBaseVectors: true,
          sumNodeOptions: VECTOR_SUM_COLORS
         } );

      this.negationScene = new SceneNode( scene.negationGraph,
         equationModel.valuesVisibleProperty,
         equationModel.angleVisibleProperty,
         equationModel.gridVisibleProperty,
         equationModel.componentStyleProperty,
         {
          includeEraser: false,
          includeBaseVectors: true,
          sumNodeOptions: VECTOR_SUM_COLORS
         } );

      scene.equationTypeProperty.link( equationType => {
        this.additionScene.visible = equationType === EquationTypes.ADDITION;
        this.subtractionScene.visible = equationType === EquationTypes.SUBTRACTION;
        this.negationScene.visible = equationType === EquationTypes.NEGATION;

      } );
      this.setChildren( [ this.additionScene, this.subtractionScene, this.negationScene ] );
      //----------------------------------------------------------------------------------------
      // Create the scenery nodes

      this.additionScene.addChild( new CoefficientSelectorPanel( scene.additionGraph.vectorSet, {
        centerY: PANEL_CENTER_Y
      } ) );
 
      this.subtractionScene.addChild( new CoefficientSelectorPanel( scene.subtractionGraph.vectorSet, {
        centerY: PANEL_CENTER_Y
      } ) );
      this.negationScene.addChild( new CoefficientSelectorPanel( scene.negationGraph.vectorSet, {
        centerY: PANEL_CENTER_Y
      } ) );


      const equationTypesRadioButtonGroup = new EquationTypesRadioButtonGroup( scene.equationTypeProperty, scene.additionGraph.vectorSet, {
        centerY: PANEL_CENTER_Y
      } );

      this.addChild( equationTypesRadioButtonGroup );

      //----------------------------------------------------------------------------------------

      // // Add the rest of the vectors
      scene.additionGraph.vectorSet.vectors.forEach( vector => {
        const baseVector = new VectorNode( vector.baseVector,
          scene.additionGraph,
          equationModel.valuesVisibleProperty,
          equationModel.angleVisibleProperty,
          {
            opacity: 0.5
          } );
        scene.baseVectorsVisibleProperty.linkAttribute( baseVector, 'visible' );

        this.additionScene.baseVectorContainer.addChild( baseVector );
      } );

      scene.subtractionGraph.vectorSet.vectors.forEach( vector => {
        const baseVector = new VectorNode( vector.baseVector,
          scene.subtractionGraph,
          equationModel.valuesVisibleProperty,
          equationModel.angleVisibleProperty,
          {
            opacity: 0.5
          } );
        scene.baseVectorsVisibleProperty.linkAttribute( baseVector, 'visible' );

        this.subtractionScene.baseVectorContainer.addChild( baseVector );
      } );

      scene.negationGraph.vectorSet.vectors.forEach( vector => {
        const baseVector = new VectorNode( vector.baseVector,
          scene.negationGraph,
          equationModel.valuesVisibleProperty,
          equationModel.angleVisibleProperty,
          {
            opacity: 0.5
          } );
        scene.baseVectorsVisibleProperty.linkAttribute( baseVector, 'visible' );

        this.negationScene.baseVectorContainer.addChild( baseVector );
      } );


      this.addChild( new BaseVectorsAccordionBox( scene.baseVectorsVisibleProperty ) );
    }
  }

  return vectorAddition.register( 'EquationSceneNode', EquationSceneNode );
} );