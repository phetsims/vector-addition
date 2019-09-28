// Copyright 2019, University of Colorado Boulder

/**
 * EquationSceneNode is a SceneNode that is specific to the 'Equation' screen.
 *
 * 'Is A' relationship with SceneNode but adds:
 *  - a EquationTypeRadio Button Group
 *  - a Coefficient Selector Panel for each Equation Type
 *  - a Base Vector Accordion Box
 *  - 'register' Vectors and add their Base Vectors and their components
 *  - Disables the Eraser button
 *
 * @author Brandon Li
 * @author Chris Malley (PixelZoom, Inc.)
 */

define( require => {
  'use strict';

  // modules
  const BaseVectorsAccordionBox = require( 'VECTOR_ADDITION/equation/view/BaseVectorsAccordionBox' );
  const EquationGraph = require( 'VECTOR_ADDITION/equation/model/EquationGraph' );
  const EquationToggleBox = require( 'VECTOR_ADDITION/equation/view/EquationToggleBox' );
  const EquationViewProperties = require( 'VECTOR_ADDITION/equation/view/EquationViewProperties' );
  const merge = require( 'PHET_CORE/merge' );
  const SceneNode = require( 'VECTOR_ADDITION/common/view/SceneNode' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorNode = require( 'VECTOR_ADDITION/common/view/VectorNode' );

  class EquationSceneNode extends SceneNode {

    /**
     * @param {EquationGraph} graph
     * @param {EquationViewProperties} viewProperties
     * @param {EnumerationProperty.<ComponentStyles>} componentStyleProperty
     * @param {number} graphControlPanelBottom
     * @param {Object} [options]
     */
    constructor( graph, viewProperties, componentStyleProperty, graphControlPanelBottom, options ) {

      assert && assert( graph instanceof EquationGraph, `invalid graph: ${graph}` );
      assert && assert( viewProperties instanceof EquationViewProperties, `invalid viewProperties: ${viewProperties}` );

      options = merge( {

        // super-class options
        includeEraser: false

      }, options );

      super( graph, viewProperties, componentStyleProperty, options );

      // Relocate the 'Vector Values' toggle box so that we have room for the 'Equation' toggle box
      this.vectorValuesToggleBox.top = VectorAdditionConstants.SCREEN_VIEW_BOUNDS.minY + VectorAdditionConstants.SCREEN_VIEW_Y_MARGIN;

      // Add the 'Equation' toggle box
      const equationToggleBox = new EquationToggleBox( graph.vectorSet, graph.equationTypeProperty, {
        expandedProperty: viewProperties.equationsExpandedProperty,
        centerX: graph.graphViewBounds.centerX,
        top: this.vectorValuesToggleBox.bottom + 10
      } );
      this.addChild( equationToggleBox );
      equationToggleBox.moveToBack(); // move to back to ensure that this.vectorContainer remains in front

      // Add the 'Base Vector' accordion box
      const baseVectorsAccordionBox = new BaseVectorsAccordionBox( viewProperties.baseVectorsVisibleProperty,
        graph.coordinateSnapMode,
        graph.vectorSet, {
          expandedProperty: viewProperties.baseVectorsExpandedProperty,
          right: VectorAdditionConstants.SCREEN_VIEW_BOUNDS.maxX - VectorAdditionConstants.SCREEN_VIEW_X_MARGIN,
          top: graphControlPanelBottom + 8
        } );
      this.addChild( baseVectorsAccordionBox );
      baseVectorsAccordionBox.moveToBack(); // move to back to ensure that this.vectorContainer remains in front

      // 'Register' vectors and add their base vectors.
      // Base vectors do not have component vectors, see https://github.com/phetsims/vector-addition/issues/158
      graph.vectorSet.vectors.forEach( equationVector => {

        // register the vector to create the Nodes
        this.registerVector( equationVector, graph.vectorSet );

        const baseVectorNode = new VectorNode( equationVector.baseVector, graph,
          viewProperties.valuesVisibleProperty,
          viewProperties.anglesVisibleProperty, {
            arrowOptions: _.extend( {}, VectorAdditionConstants.BASE_VECTOR_ARROW_OPTIONS, {
              fill: graph.vectorSet.vectorColorPalette.baseVectorFill,
              stroke: graph.vectorSet.vectorColorPalette.baseVectorStroke
            } )
          } );

        viewProperties.baseVectorsVisibleProperty.linkAttribute( baseVectorNode, 'visible' );

        this.addBaseVectorNode( baseVectorNode );

        // When the base vector becomes selected, move it to the front.
        // unlink is unnecessary because base vectors exist for the lifetime of the sim.
        graph.activeVectorProperty.link( activeVector => {
          if ( activeVector === baseVectorNode.vector ) {
            baseVectorNode.moveToFront();
          }
        } );
      } );
    }
  }

  return vectorAddition.register( 'EquationSceneNode', EquationSceneNode );
} );