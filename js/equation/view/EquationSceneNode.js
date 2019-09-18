// Copyright 2019, University of Colorado Boulder

/**
 * A Scene Node specific to the 'Equation' screen. See ../common/view/SceneNode.js for context on Scene Node
 *
 * 'Is A' relationship with Scene Node but adds:
 *  - a Equation Selector Radio Button Group
 *  - a Coefficient Selector Panel for each Equation Type
 *  - a Base Vector Accordion Box
 *  - 'register' Vectors and add their Base Vectors and their components
 *  - Disables the Eraser button
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const BaseVectorsAccordionBox = require( 'VECTOR_ADDITION/equation/view/BaseVectorsAccordionBox' );
  const EquationGraph = require( 'VECTOR_ADDITION/equation/model/EquationGraph' );
  const EquationToggleBox = require( 'VECTOR_ADDITION/equation/view/EquationToggleBox' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const EquationTypesRadioButtonGroup = require( 'VECTOR_ADDITION/equation/view/EquationTypesRadioButtonGroup' );
  const EquationViewProperties = require( 'VECTOR_ADDITION/equation/view/EquationViewProperties' );
  const merge = require( 'PHET_CORE/merge' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );

  class EquationSceneNode extends SceneNode {

    /**
     * @param {EquationGraph} equationGraph
     * @param {EquationViewProperties} viewProperties
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {number} graphControlPanelBottom
     * @param {Object} [options]
     */
    constructor( equationGraph, viewProperties, componentStyleProperty, graphControlPanelBottom, options ) {

      assert && assert( equationGraph instanceof EquationGraph, `invalid equationGraph: ${equationGraph}` );
      assert && assert( viewProperties instanceof EquationViewProperties, `invalid viewProperties: ${viewProperties}` );

      options = merge( {

        // super-class options
        includeEraser: false,
        vectorValuesToggleBoxOptions: {
          spacingMajor: 25,
          contentFixedWidth: 470
        }

      }, options );

      super( equationGraph, viewProperties, componentStyleProperty, options );

      this.vectorValuesToggleBox.top = VectorAdditionConstants.SCREEN_VIEW_BOUNDS.minY + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN;

      // convenience reference
      const graphViewBounds = equationGraph.graphViewBounds;

      //----------------------------------------------------------------------------------------
      // Add a Coefficient Selector for each Equation Type
      let lastEquationToggleBox = null;
      EquationTypes.VALUES.forEach( equationType => {

        const equationToggleBox = new EquationToggleBox( equationGraph.vectorSet, equationType, {
          expandedProperty: viewProperties.equationsExpandedProperty,
          left: graphViewBounds.left,
          top: this.vectorValuesToggleBox.bottom + 10
        } );

        // Doesn't need to be unlinked since the equationToggleBox and the scene is never disposed
        equationGraph.equationTypeProperty.link( () => {
          equationToggleBox.visible = equationType === equationGraph.equationTypeProperty.value;
        } );

        this.addChild( equationToggleBox );
        equationToggleBox.moveToBack(); // move to back to ensure that this.vectorContainer remains in front

        lastEquationToggleBox = equationToggleBox;
      } );

      //----------------------------------------------------------------------------------------
      // Add the "Equation Selector Radio Button Group"
      const equationTypesRadioButtonGroup = new EquationTypesRadioButtonGroup( equationGraph.equationTypeProperty,
        equationGraph.vectorSet.symbols, {
          centerY: lastEquationToggleBox.centerY,
          left: lastEquationToggleBox.right + 20
        } );

      this.addChild( equationTypesRadioButtonGroup );
      equationTypesRadioButtonGroup.moveToBack(); // move to back to ensure that this.vectorContainer remains in front

      //----------------------------------------------------------------------------------------
      // Add a Base Vector Accordion Box

      const baseVectorsAccordionBox = new BaseVectorsAccordionBox( viewProperties.baseVectorsVisibleProperty,
        equationGraph.coordinateSnapMode,
        equationGraph.vectorSet, {
        expandedProperty: viewProperties.baseVectorsExpandedProperty,
          right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.maxX - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: graphControlPanelBottom + 8
        } );

      // Add the base vectors accordion box (semi-global)
      this.addChild( baseVectorsAccordionBox );
      baseVectorsAccordionBox.moveToBack(); // move to back to ensure that this.vectorContainer remains in front

      //----------------------------------------------------------------------------------------
      // 'Register' vectors and add their base vectors.
      // Base vectors do not have component vectors, see https://github.com/phetsims/vector-addition/issues/158
      equationGraph.vectorSet.vectors.forEach( equationVector => {

        // register the vector to create the Nodes
        this.registerVector( equationVector, equationGraph.vectorSet );

        const baseVectorNode = new VectorNode( equationVector.baseVector, equationGraph,
          viewProperties.valuesVisibleProperty,
          viewProperties.anglesVisibleProperty, {
            arrowOptions: _.extend( {}, VectorAdditionConstants.BASE_VECTOR_ARROW_OPTIONS, {
              fill: equationGraph.vectorSet.vectorColorPalette.baseVectorFill,
              stroke: equationGraph.vectorSet.vectorColorPalette.baseVectorStroke
            } )
        } );

        viewProperties.baseVectorsVisibleProperty.linkAttribute( baseVectorNode, 'visible' );

        this.addBaseVectorNode( baseVectorNode );

        // When the base vector becomes selected, move it to the front.
        // Unlink is unnecessary because base vectors exist for the lifetime of the sim.
        equationGraph.activeVectorProperty.link( activeVector => {
          if ( activeVector === baseVectorNode.vector ) {
            baseVectorNode.moveToFront();
          }
        } );
      } );
    }
  }

  return vectorAddition.register( 'EquationSceneNode', EquationSceneNode );
} );